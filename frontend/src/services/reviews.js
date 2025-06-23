import axios from 'axios';

const API_URL = 'http://localhost:5000'; // Update with your backend URL

export const fetchRecipeReviews = async (recipeId, page = 1, perPage = 5) => {
  const response = await axios.get(`${API_URL}/reviews/recipe/${recipeId}`, {
    params: { page, per_page: perPage }
  });
  return response.data;
};

export const createReview = async (reviewData, token) => {
  const response = await axios.post(`${API_URL}/reviews`, reviewData, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
};

export const updateReview = async (reviewId, reviewData, token) => {
  const response = await axios.put(`${API_URL}/reviews/${reviewId}`, reviewData, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
};

export const deleteReview = async (reviewId, token) => {
  const response = await axios.delete(`${API_URL}/reviews/${reviewId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
};