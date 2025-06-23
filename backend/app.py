from flask import Flask, jsonify
from flask_migrate import Migrate
from flask_cors import CORS
from config import Config
from models import db
import os

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Initialize extensions
    db.init_app(app)
    migrate = Migrate(app, db)
    CORS(app)
    
    # Register blueprints
    from routes.auth_routes import auth_bp
    from routes.recipe_routes import recipe_bp
    from routes.review_routes import review_bp
    from routes.user_routes import user_bp
    
    app.register_blueprint(auth_bp)
    app.register_blueprint(recipe_bp, url_prefix='/api/recipes')
    app.register_blueprint(review_bp, url_prefix='/api/reviews')
    app.register_blueprint(user_bp, url_prefix='/api/users')
    
    # Create tables
    with app.app_context():
        db.create_all()
    
    @app.route('/')
    def home():
        return jsonify({"message": "Recipe Book API is running"})
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)