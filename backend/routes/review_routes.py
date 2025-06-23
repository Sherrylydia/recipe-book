from flask import Blueprint, request, jsonify
from models import db, Review
from utils.auth import token_required

review_bp = Blueprint('reviews', __name__)

@review_bp.route('/recipe/<int:recipe_id>', methods=['GET'])
def get_recipe_reviews(recipe_id):
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 5, type=int)
    
    reviews = Review.query.filter_by(recipe_id=recipe_id).paginate(page=page, per_page=per_page)
    
    reviews_data = []
    for review in reviews.items:
        reviews_data.append({
            'id': review.id,
            'content': review.content,
            'rating': review.rating,
            'user': {
                'id': review.user.id,
                'username': review.user.username
            },
            'created_at': review.created_at
        })
    
    return jsonify({
        'reviews': reviews_data,
        'total': reviews.total,
        'pages': reviews.pages,
        'current_page': reviews.page
    })

@review_bp.route('/', methods=['POST'])
@token_required
def create_review(current_user):
    data = request.get_json()
    recipe_id = data.get('recipe_id')
    content = data.get('content')
    rating = data.get('rating')
    
    if not all([recipe_id, rating]):
        return jsonify({"error": "Missing required fields"}), 400
    
    if not 1 <= rating <= 5:
        return jsonify({"error": "Rating must be between 1 and 5"}), 400
    
    # Check if user already reviewed this recipe
    existing_review = Review.query.filter_by(
        user_id=current_user.id,
        recipe_id=recipe_id
    ).first()
    
    if existing_review:
        return jsonify({"error": "You have already reviewed this recipe"}), 400
    
    new_review = Review(
        content=content,
        rating=rating,
        user_id=current_user.id,
        recipe_id=recipe_id
    )
    
    db.session.add(new_review)
    db.session.commit()
    
    return jsonify({
        "message": "Review created successfully",
        "review": {
            "id": new_review.id,
            "content": new_review.content,
            "rating": new_review.rating,
            "created_at": new_review.created_at
        }
    }), 201

@review_bp.route('/<int:review_id>', methods=['PUT'])
@token_required
def update_review(current_user, review_id):
    review = Review.query.get_or_404(review_id)
    
    if review.user_id != current_user.id:
        return jsonify({"error": "Unauthorized to edit this review"}), 403
    
    data = request.get_json()
    content = data.get('content')
    rating = data.get('rating')
    
    if rating and not 1 <= rating <= 5:
        return jsonify({"error": "Rating must be between 1 and 5"}), 400
    
    if content is not None:
        review.content = content
    if rating is not None:
        review.rating = rating
    
    db.session.commit()
    
    return jsonify({"message": "Review updated successfully"})

@review_bp.route('/<int:review_id>', methods=['DELETE'])
@token_required
def delete_review(current_user, review_id):
    review = Review.query.get_or_404(review_id)
    
    if review.user_id != current_user.id:
        return jsonify({"error": "Unauthorized to delete this review"}), 403
    
    db.session.delete(review)
    db.session.commit()
    
    return jsonify({"message": "Review deleted successfully"})