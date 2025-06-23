import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fetchUserFavorites } from '../../services/users';
import RecipeCard from '../Recipe/RecipeCard';
import Loading from '../UI/Loading';
import Alert from '../UI/Alert';
import Pagination from '../UI/Pagination';

const UserFavorites = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        const data = await fetchUserFavorites(user.id, currentPage);
        setFavorites(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user, currentPage]);

  if (loading && !favorites) return <Loading />;
  if (error) return <Alert message={error} type="error" />;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">My Favorites</h1>
      
      {favorites?.favorites?.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">You haven't favorited any recipes yet.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites?.favorites?.map((favorite) => (
              <RecipeCard key={favorite.id} recipe={favorite} />
            ))}
          </div>
          
          <Pagination
            currentPage={currentPage}
            totalPages={favorites?.pages || 1}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
};

export default UserFavorites;