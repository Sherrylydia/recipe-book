import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser, resetPassword, getCurrentUser } from '../services/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (token) {
          const userData = await getCurrentUser(token);
          setUser(userData);
        }
      } catch (err) {
        console.error('Error fetching user:', err);
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  const login = async (credentials) => {
    try {
      const { token, user } = await loginUser(credentials);
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
      navigate('/');
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      const { token, user } = await registerUser(userData);
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
      navigate('/');
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const resetPass = async (data) => {
    try {
      await resetPassword(data, token);
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        login,
        register,
        resetPass,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);