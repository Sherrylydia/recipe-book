import axios from "axios";

const API_URL = "https://recipe-book-prsm.onrender.com"; 

export const fetchRecipeReviews = async (recipeId, page = 1, perPage = 5) => {
  const response = await axios.get(
    `${API_URL}/api/reviews/recipe/${recipeId}`,
    {
      params: { page, per_page: perPage },
    }
  );
  return response.data;
};

export const createReview = async (reviewData, token) => {
  const response = await axios.post(`${API_URL}/api/reviews`, reviewData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const updateReview = async (reviewId, reviewData, token) => {
  const response = await axios.put(
    `${API_URL}/api/reviews/${reviewId}`,
    reviewData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const deleteReview = async (reviewId, token) => {
  console.log('Deleting review', reviewId, 'with token', token);
  const response = await axios.delete(`${API_URL}/api/reviews/${reviewId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
