import { createContext, useContext, useState } from "react";
import {
  fetchRecipes,
  fetchRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  favoriteRecipe,
  unfavoriteRecipe,
} from "../services/recipes";

const RecipeContext = createContext();

export const RecipeProvider = ({ children }) => {
  const [recipes, setRecipes] = useState([]);
  const [currentRecipe, setCurrentRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getRecipes = async (search = "", page = 1) => {
    try {
      setLoading(true);
      const data = await fetchRecipes(search, page);
      setRecipes(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getRecipe = async (id) => {
    try {
      setLoading(true);
      const recipe = await fetchRecipeById(id);
      setCurrentRecipe(recipe);
      return recipe;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addRecipe = async (recipeData) => {
    try {
      setLoading(true);
      const newRecipe = await createRecipe(recipeData);
      return newRecipe;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const editRecipe = async (id, recipeData) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const updatedRecipe = await updateRecipe(id, recipeData, token);
      return updatedRecipe;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeRecipe = async (id) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      await deleteRecipe(id, token);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addFavorite = async (recipeId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await favoriteRecipe(recipeId, token);
      // Update the recipes array to reflect the favorite status
      setRecipes((prevRecipes) =>
        prevRecipes.map((recipe) =>
          recipe.id === recipeId ? { ...recipe, is_favorited: true } : recipe
        )
      );
      return true;
    } catch (err) {
      if (err.response?.status === 400) {
        // If already favorited, sync the state
        setRecipes((prevRecipes) =>
          prevRecipes.map((recipe) =>
            recipe.id === recipeId ? { ...recipe, is_favorited: true } : recipe
          )
        );
        return true;
      }
      setError(err.message);
      throw err;
    }
  };

  const removeFavorite = async (recipeId) => {
    try {
      const token = localStorage.getItem("token");
      await unfavoriteRecipe(recipeId, token);
      // Update the recipes array
      setRecipes((prevRecipes) =>
        prevRecipes.map((recipe) =>
          recipe.id === recipeId ? { ...recipe, is_favorited: false } : recipe
        )
      );
      return false;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const handleFavorite = async (recipe) => {
    try {
      if (recipe.is_favorited) {
        return await removeFavorite(recipe.id);
      } else {
        return await addFavorite(recipe.id);
      }
    } catch (err) {
      console.error("Error handling favorite:", err);
      throw err;
    }
  };

  return (
    <RecipeContext.Provider
      value={{
        recipes,
        currentRecipe,
        loading,
        error,
        getRecipes,
        getRecipe,
        addRecipe,
        editRecipe,
        removeRecipe,
        addFavorite,
        removeFavorite,
        handleFavorite,
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
};

export const useRecipes = () => useContext(RecipeContext);
