import axios from 'axios';

const API_URL = 'https://recipe-book-prsm.onrender.com'; // My backend URL

export const registerUser = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await axios.post(`${API_URL}/login`, credentials);
  return response.data;
};

export const resetPassword = async (data, token) => {
  const response = await axios.post(`${API_URL}/reset-password`, data, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
};

export const getCurrentUser = async (token) => {
  const response = await axios.get(`${API_URL}/api/users/me`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
};