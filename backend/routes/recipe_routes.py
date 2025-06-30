from flask import Blueprint, request, jsonify
from models import db, Recipe, Ingredient, Favorite, recipe_ingredient
from utils.auth import token_required
from sqlalchemy import or_
from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request

recipe_bp = Blueprint('recipes', __name__)

@recipe_bp.route('/', methods=['GET'])
def get_all_recipes():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    search = request.args.get('search', '')
    
    query = Recipe.query
    
    if search:
        query = query.filter(or_(
            Recipe.title.ilike(f'%{search}%'),
            Recipe.description.ilike(f'%{search}%')
        ))
    
    recipes = query.paginate(page=page, per_page=per_page)
    
    user_id = None
    try:
        verify_jwt_in_request(optional=True)
        user_id = get_jwt_identity()
    except Exception:
        pass

    recipes_data = []
    for recipe in recipes.items:
        is_favorited = False
        if user_id:
            is_favorited = Favorite.query.filter_by(user_id=user_id, recipe_id=recipe.id).first() is not None
        recipes_data.append({
            'id': recipe.id,
            'title': recipe.title,
            'description': recipe.description,
            'author': recipe.author.username,
            'created_at': recipe.created_at,
            'is_favorited': is_favorited
        })
    
    return jsonify({
        'recipes': recipes_data,
        'total': recipes.total,
        'pages': recipes.pages,
        'current_page': recipes.page
    })

@recipe_bp.route('/<int:recipe_id>', methods=['GET'])
def get_recipe(recipe_id):
    recipe = Recipe.query.get_or_404(recipe_id)
    
    ingredients = []
    for ingredient in recipe.ingredients:
        
        association = db.session.query(recipe_ingredient).filter_by(
            recipe_id=recipe.id,
            ingredient_id=ingredient.id
        ).first()
        amount = association.amount if association else None
        
        ingredients.append({
            'id': ingredient.id,
            'name': ingredient.name,
            'amount': amount
        })
    
    reviews = []
    for review in recipe.reviews:
        reviews.append({
            'id': review.id,
            'content': review.content,
            'rating': review.rating,
            'user': review.user.username,
            'created_at': review.created_at
        })
    
    return jsonify({
        'id': recipe.id,
        'title': recipe.title,
        'description': recipe.description,
        'instructions': recipe.instructions,
        'author': {
            'id': recipe.author.id,
            'username': recipe.author.username
        },
        'created_at': recipe.created_at,
        'ingredients': ingredients,
        'reviews': reviews
    })

@recipe_bp.route('/add', methods=['POST'])
@token_required
def create_recipe(current_user):
    data = request.get_json()
    
    if not all([data.get('title'), data.get('instructions')]):
        return jsonify({"error": "Missing required fields"}), 400
    
    
    new_recipe = Recipe(
        title=data['title'],
        description=data.get('description', ''),
        instructions=data['instructions'],
        user_id=current_user.id
    )
    
    db.session.add(new_recipe)
    db.session.flush()  
    
    
    for ingredient_data in data.get('ingredients', []):
        ingredient = Ingredient.query.filter_by(name=ingredient_data['name']).first()
        if not ingredient:
            ingredient = Ingredient(name=ingredient_data['name'])
            db.session.add(ingredient)
            db.session.flush()  
        
        
        stmt = recipe_ingredient.insert().values(
            recipe_id=new_recipe.id,
            ingredient_id=ingredient.id,
            amount=ingredient_data.get('amount')
        )
        db.session.execute(stmt)
    
    db.session.commit()  
    
    return jsonify({
        "message": "Recipe created successfully",
        "recipe_id": new_recipe.id
    }), 201

@recipe_bp.route('/<int:recipe_id>', methods=['PUT'])
@token_required
def update_recipe(current_user, recipe_id):
    try:
        
        recipe = Recipe.query.get_or_404(recipe_id)
        
        
        if recipe.user_id != current_user.id:
            return jsonify({"error": "Unauthorized to edit this recipe"}), 403
        
        data = request.get_json()
        
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
            
        
        if 'title' in data:
            recipe.title = data['title']
        if 'description' in data:
            recipe.description = data.get('description', '')
        if 'instructions' in data:
            recipe.instructions = data['instructions']
        
        
        if 'ingredients' in data:
            
            if not isinstance(data['ingredients'], list):
                return jsonify({"error": "Ingredients must be an array"}), 400
                
            
            db.session.execute(
                recipe_ingredient.delete().where(
                    recipe_ingredient.c.recipe_id == recipe.id
                )
            )
            
            
            for ingredient_data in data['ingredients']:
                if not ingredient_data.get('name'):
                    continue  
                    
                
                ingredient = Ingredient.query.filter_by(
                    name=ingredient_data['name'].strip()
                ).first()
                
                if not ingredient:
                    ingredient = Ingredient(name=ingredient_data['name'].strip())
                    db.session.add(ingredient)
                    db.session.flush()  
                
                
                db.session.execute(
                    recipe_ingredient.insert().values(
                        recipe_id=recipe.id,
                        ingredient_id=ingredient.id,
                        amount=ingredient_data.get('amount', '').strip()
                    )
                )
        
        db.session.commit()
        return jsonify({
            "message": "Recipe updated successfully",
            "recipe_id": recipe.id
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@recipe_bp.route('/<int:recipe_id>', methods=['DELETE'])
@token_required
def delete_recipe(current_user, recipe_id):
    try:
        recipe = Recipe.query.get_or_404(recipe_id)
        
        if recipe.user_id != current_user.id:
            return jsonify({"error": "Unauthorized to delete this recipe"}), 403
        
        
        db.session.delete(recipe)
        db.session.commit()
        
        return jsonify({"message": "Recipe deleted successfully"}), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Failed to delete recipe: {str(e)}"}), 500

@recipe_bp.route('/<int:recipe_id>/favorite', methods=['POST'])
@token_required
def favorite_recipe(current_user, recipe_id):
    recipe = Recipe.query.get_or_404(recipe_id)
    
   
    existing_favorite = Favorite.query.filter_by(
        user_id=current_user.id,
        recipe_id=recipe.id
    ).first()
    
    if existing_favorite:
        return jsonify({"error": "Recipe already favorited"}), 400
    
    new_favorite = Favorite(
        user_id=current_user.id,
        recipe_id=recipe.id
    )
    
    db.session.add(new_favorite)
    db.session.commit()
    
    return jsonify({"message": "Recipe added to favorites"}), 201

@recipe_bp.route('/<int:recipe_id>/favorite', methods=['DELETE'])
@token_required
def unfavorite_recipe(current_user, recipe_id):
    favorite = Favorite.query.filter_by(
        user_id=current_user.id,
        recipe_id=recipe_id
    ).first_or_404()
    
    db.session.delete(favorite)
    db.session.commit()
    
    return jsonify({"message": "Recipe removed from favorites"})