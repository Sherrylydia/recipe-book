import axios from 'axios';

const API_URL = 'http://localhost:5000'; // Update with your backend URL

export const fetchRecipes = async (search = '', page = 1, perPage = 10) => {
  const response = await axios.get(`${API_URL}/`, {
    params: { search, page, per_page: perPage }
  });
  return response.data;
};

export const fetchRecipeById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const createRecipe = async (recipeData, token) => {
  const response = await axios.post(`${API_URL}/recipes`, recipeData, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
};

export const updateRecipe = async (id, recipeData, token) => {
  const response = await axios.put(`${API_URL}/recipes/${id}`, recipeData, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
};

export const deleteRecipe = async (id, token) => {
  const response = await axios.delete(`${API_URL}/recipes/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
};

export const favoriteRecipe = async (recipeId, token) => {
  const response = await axios.post(`${API_URL}/recipes/${recipeId}/favorite`, {}, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
};

export const unfavoriteRecipe = async (recipeId, token) => {
  const response = await axios.delete(`${API_URL}/recipes/${recipeId}/favorite`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
};