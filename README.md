# Recipe Book

A full-stack web application for discovering, sharing, and reviewing recipes. Built with Flask (backend) and React (frontend).

## Features

- User registration, login, and JWT-based authentication
- Create, edit, and delete your own recipes
- Add ingredients and instructions to recipes
- Favorite and unfavorite recipes
- Paginated recipe browsing and search
- User profile with your recipes and favorites
- Review and rate recipes (1-5 stars)
- Responsive UI with Tailwind CSS

## Project Structure

```
recipe-book/
├── backend/
│   ├── app.py
│   ├── config.py
│   ├── models.py
│   ├── requirements.txt
│   ├── .env
│   ├── recipe_book.db
│   ├── routes/
│   │   ├── auth_routes.py
│   │   ├── recipe_routes.py
│   │   ├── review_routes.py
│   │   └── user_routes.py
│   ├── utils/
│   │   └── auth.py
│   └── migrations/
│       └── ...
├── frontend/
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── vite.config.js
│   ├── src/
│   │   ├── App.jsx
│   │   ├── index.jsx
│   │   ├── main.css
│   │   ├── routes.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.js
│   │   │   └── RecipeContext.js
│   │   ├── components/
│   │   │   ├── Auth/
│   │   │   ├── Layout/
│   │   │   ├── Recipe/
│   │   │   ├── Review/
│   │   │   ├── UI/
│   │   │   └── User/
│   │   ├── pages/
│   │   │   └── Home.jsx
│   │   └── services/
│   │       ├── auth.js
│   │       ├── recipes.js
│   │       ├── reviews.js
│   │       └── users.js
│   └── public/
│       └── index.html
└── README.md
```

## Getting Started

### Prerequisites

- Python 3.8+
- Node.js 16+
- npm

### Backend Setup

1. **Install dependencies:**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Set up environment variables:**
   Edit `.env` in the backend folder as needed (default uses SQLite).

3. **Run database migrations:**
   ```bash
   flask db upgrade
   ```

4. **Start the backend server:**
   ```bash
   python app.py
   ```
   
   The API will be available at `http://localhost:5000`.

### Frontend Setup

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Start the frontend dev server:**
   ```bash
   npm run start
   ```
   
   The app will be available at `http://localhost:3000` (or as configured).

## API Overview

- **Auth:** `/register`, `/login`, `/reset-password`
- **Recipes:** `/api/recipes`, `/api/recipes/<id>`, `/api/recipes/add`, `/api/recipes/<id>/favorite`
- **Users:** `/api/users/me`, `/api/users/me/recipes`, `/api/users/me/favorites`
- **Reviews:** `/api/reviews/recipe/<recipe_id>`, `/api/reviews`

See the `backend/routes/` files for details.

## Technologies Used

**Backend:**
- Flask
- Flask-SQLAlchemy
- Flask-Migrate
- Flask-JWT-Extended
- SQLite

**Frontend:**
- React
- React Router
- Axios
- Tailwind CSS
- Headless UI

## License

MIT License. See LICENSE for details.