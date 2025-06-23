import { Link } from 'react-router-dom';

const Home = () => (
  <div className="max-w-3xl mx-auto py-16 text-center">
    <h1 className="text-4xl font-bold text-indigo-700 mb-4">Welcome to RecipeBook!</h1>
    <p className="text-lg text-gray-700 mb-8">
      Discover, share, and review your favorite recipes. Join our community to create your own recipes and explore what others are cooking!
    </p>
    <div className="flex justify-center space-x-4">
      <Link
        to="/recipes"
        className="bg-indigo-600 text-white px-6 py-3 rounded-md text-lg hover:bg-indigo-700 transition"
      >
        Browse Recipes
      </Link>
      <Link
        to="/register"
        className="bg-white border border-indigo-600 text-indigo-700 px-6 py-3 rounded-md text-lg hover:bg-indigo-50 transition"
      >
        Get Started
      </Link>
    </div>
  </div>
);

export default Home;