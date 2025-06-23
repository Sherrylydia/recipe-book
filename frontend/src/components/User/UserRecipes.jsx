import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fetchUserRecipes } from '../../services/users';
import RecipeCard from '../Recipe/RecipeCard';
import Loading from '../UI/Loading';
import Alert from '../UI/Alert';
import Pagination from '../UI/Pagination';

const UserRecipes = () => {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        const data = await fetchUserRecipes(user.id, currentPage);
        setRecipes(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [user, currentPage]);

  if (loading && !recipes) return <Loading />;
  if (error) return <Alert message={error} type="error" />;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">My Recipes</h1>
      
      {recipes?.recipes?.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">You haven't created any recipes yet.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes?.recipes?.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} showActions />
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

export default UserRecipes;