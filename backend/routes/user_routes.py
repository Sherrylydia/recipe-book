from flask import Blueprint, request, jsonify
from models import db, User, Recipe, Favorite
from utils.auth import token_required
from sqlalchemy import desc

user_bp = Blueprint('users', __name__)

@user_bp.route('/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = User.query.get_or_404(user_id)
    
    return jsonify({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'created_at': user.created_at
    })

@user_bp.route('/me', methods=['GET'])
@token_required
def get_current_user(current_user):
    return jsonify({
        'id': current_user.id,
        'username': current_user.username,
        'email': current_user.email,
        'created_at': current_user.created_at
    })

@user_bp.route('/me/recipes', methods=['GET'])
@token_required
def get_user_recipes(current_user):
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    
    recipes = Recipe.query.filter_by(user_id=current_user.id).order_by(
        desc(Recipe.created_at)
    ).paginate(page=page, per_page=per_page)
    
    recipes_data = []
    for recipe in recipes.items:
        recipes_data.append({
            'id': recipe.id,
            'title': recipe.title,
            'description': recipe.description,
            'created_at': recipe.created_at
        })
    
    return jsonify({
        'recipes': recipes_data,
        'total': recipes.total,
        'pages': recipes.pages,
        'current_page': recipes.page
    })

@user_bp.route('/me/favorites', methods=['GET'])
@token_required
def get_user_favorites(current_user):
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    
    favorites = Favorite.query.filter_by(user_id=current_user.id).order_by(
        desc(Favorite.created_at)
    ).paginate(page=page, per_page=per_page)
    
    favorites_data = []
    for favorite in favorites.items:
        favorites_data.append({
            'id': favorite.recipe.id,
            'title': favorite.recipe.title,
            'description': favorite.recipe.description,
            'author': favorite.recipe.author.username,
            'favorited_at': favorite.created_at
        })
    
    return jsonify({
        'favorites': favorites_data,
        'total': favorites.total,
        'pages': favorites.pages,
        'current_page': favorites.page
    })