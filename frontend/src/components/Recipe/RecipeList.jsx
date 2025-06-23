import { useEffect, useState } from 'react';
import { useRecipes } from '../../context/RecipeContext';
import RecipeCard from './RecipeCard';
import Pagination from '../UI/Pagination';
import Loading from '../UI/Loading';
import Alert from '../UI/Alert';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const RecipeList = () => {
  const { recipes, loading, error, getRecipes } = useRecipes();
  const { isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    getRecipes(searchTerm, currentPage);
  }, [searchTerm, currentPage]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    getRecipes(searchTerm, 1);
  };

  if (loading && !recipes) return <Loading />;
  if (error) return <Alert message={error} type="error" />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Recipes</h1>
        {isAuthenticated && (
          <Link
            to="/recipes/new"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
          >
            Add Recipe
          </Link>
        )}
      </div>

      <form onSubmit={handleSearch} className="flex">
        <input
          type="text"
          placeholder="Search recipes..."
          className="px-4 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded-r-md hover:bg-indigo-700 transition"
        >
          Search
        </button>
      </form>

      {recipes?.recipes?.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">No recipes found. Try a different search term.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes?.recipes?.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
          
          <Pagination
            currentPage={currentPage}
            totalPages={recipes?.pages || 1}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
};

export default RecipeList;