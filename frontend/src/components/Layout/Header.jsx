import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-indigo-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          RecipeBook
        </Link>
        
        <nav className="flex items-center space-x-6">
          <Link to="/recipes" className="hover:text-indigo-200 transition">
            Recipes
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="hover:text-indigo-200 transition">
                Profile
              </Link>
              <button 
                onClick={handleLogout}
                className="bg-white text-indigo-600 px-4 py-2 rounded-md hover:bg-indigo-50 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-indigo-200 transition">
                Login
              </Link>
              <Link 
                to="/register" 
                className="bg-white text-indigo-600 px-4 py-2 rounded-md hover:bg-indigo-50 transition"
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;