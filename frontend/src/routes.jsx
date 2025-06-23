import Home from './pages/Home';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ResetPassword from './components/Auth/ResetPassword';
import RecipeList from './components/Recipe/RecipeList';
import RecipeDetail from './components/Recipe/RecipeDetail';
import RecipeForm from './components/Recipe/RecipeForm';
import Profile from './components/User/Profile';
import UserRecipes from './components/User/UserRecipes';
import UserFavorites from './components/User/UserFavorites';

const routes = [
  { path: '/', component: <Home /> },
  { path: '/login', component: <Login /> },
  { path: '/register', component: <Register /> },
  { path: '/reset-password', component: <ResetPassword />, private: true },
  { path: '/recipes', component: <RecipeList /> },
  { path: '/recipes/:recipeId', component: <RecipeDetail /> },
  { path: '/recipes/new', component: <RecipeForm />, private: true },
  { path: '/recipes/:recipeId/edit', component: <RecipeForm />, private: true },
  { path: '/profile', component: <Profile />, private: true },
  { path: '/my-recipes', component: <UserRecipes />, private: true },
  { path: '/favorites', component: <UserFavorites />, private: true },
];

export default routes;