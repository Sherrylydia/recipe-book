import axios from 'axios';

const API_URL = 'http://localhost:5000'; // Update with your backend URL

export const fetchRecipes = async (search = '', page = 1, perPage = 10) => {
  const response = await axios.get(`${API_URL}/api/recipes`, {
    params: { search, page, per_page: perPage }
  });
  return response.data;
};

export const fetchRecipeById = async (id) => {
  const response = await axios.get(`${API_URL}/api/recipes/${id}`);
  return response.data;
};

export const createRecipe = async (recipeData) => {
  const token = localStorage.getItem('token');
  const response = await axios.post(`${API_URL}/api/recipes/add`, recipeData, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
};

export const updateRecipe = async (recipeId, recipeData, token) => {
  const response = await axios.put(
    `${API_URL}/api/recipes/${recipeId}`,
    recipeData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export const deleteRecipe = async (id, token) => {
  const response = await axios.delete(`${API_URL}/api/recipes/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
};

export const favoriteRecipe = async (recipeId, token) => {
  const response = await axios.post(
    `${API_URL}/api/recipes/${recipeId}/favorite`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export const unfavoriteRecipe = async (recipeId, token) => {
  const response = await axios.delete(`${API_URL}/api/recipes/${recipeId}/favorite`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
};