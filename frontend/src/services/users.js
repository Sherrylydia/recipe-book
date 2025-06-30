import axios from 'axios';

const API_URL = 'https://recipe-book-prsm.onrender.com'; 

export const fetchUserProfile = async (userId) => {
  const response = await axios.get(`${API_URL}/api/users/${userId}`);
  return response.data;
};

export const fetchUserRecipes = async (userId, page = 1, perPage = 10) => {
  const response = await axios.get(`${API_URL}/api/users/me/recipes`, {
    params: { page, per_page: perPage },
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  return response.data;
};

export const fetchUserFavorites = async (userId, page = 1, perPage = 10) => {
  const response = await axios.get(`${API_URL}/api/users/me/favorites`, {
    params: { page, per_page: perPage },
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  return response.data;
};