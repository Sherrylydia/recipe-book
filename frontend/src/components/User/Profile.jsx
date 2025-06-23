import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fetchUserProfile, fetchUserRecipes, fetchUserFavorites } from '../../services/users';
import RecipeCard from '../Recipe/RecipeCard';
import Loading from '../UI/Loading';
import Alert from '../UI/Alert';
import { Tab } from '@headlessui/react';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [recipes, setRecipes] = useState(null);
  const [favorites, setFavorites] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [profileData, recipesData, favoritesData] = await Promise.all([
          fetchUserProfile(user.id),
          fetchUserRecipes(user.id),
          fetchUserFavorites(user.id),
        ]);
        
        setProfile(profileData);
        setRecipes(recipesData);
        setFavorites(favoritesData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchData();
  }, [user]);

  if (loading) return <Loading />;
  if (error) return <Alert message={error} type="error" />;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
          <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-3xl font-bold">
            {profile?.username?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{profile?.username}</h1>
            <p className="text-gray-600">{profile?.email}</p>
            <p className="text-gray-500 mt-2">
              Member since {new Date(profile?.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-lg bg-gray-100 p-1 mb-6">
          <Tab
            className={({ selected }) =>
              `w-full py-2.5 text-sm font-medium rounded-md transition ${
                selected ? 'bg-white shadow text-indigo-600' : 'text-gray-600 hover:text-indigo-500'
              }`
            }
          >
            My Recipes
          </Tab>
          <Tab
            className={({ selected }) =>
              `w-full py-2.5 text-sm font-medium rounded-md transition ${
                selected ? 'bg-white shadow text-indigo-600' : 'text-gray-600 hover:text-indigo-500'
              }`
            }
          >
            Favorites
          </Tab>
        </Tab.List>
        <Tab.Panels>
          <Tab.Panel>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes?.recipes?.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} showActions />
              ))}
            </div>
          </Tab.Panel>
          <Tab.Panel>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites?.favorites?.map((favorite) => (
                <RecipeCard key={favorite.id} recipe={favorite} />
              ))}
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default Profile;