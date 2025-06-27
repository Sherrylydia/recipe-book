import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useRecipes } from "../../context/RecipeContext";

const RecipeCard = ({ recipe, showActions = false, onDelete }) => {
  const { isAuthenticated } = useAuth();
  const { handleFavorite } = useRecipes();
  const [isProcessing, setIsProcessing] = useState(false);
  const [localError, setLocalError] = useState(null);

  const handleFavoriteClick = async () => {
    if (!isAuthenticated || isProcessing) return;

    setIsProcessing(true);
    setLocalError(null);
    try {
      await handleFavorite(recipe);
    } catch (err) {
      setLocalError(err.response?.data?.error || "Failed to update favorite");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
      <div className="p-4">
        <Link to={`/recipes/${recipe.id}`}>
          <h3 className="text-xl font-semibold text-gray-800 hover:text-indigo-600 transition">
            {recipe.title}
          </h3>
        </Link>
        <p className="text-gray-600 mt-2 line-clamp-2">
          {recipe.description || "No description provided"}
        </p>
        <div className="mt-4 flex justify-between items-center">
          <span className="text-sm text-gray-500">
            By {recipe.author?.username || "Unknown"}
          </span>
          {isAuthenticated && (
            <button
              onClick={handleFavoriteClick}
              className={`p-2 rounded-full ${
                recipe.is_favorited ? "text-yellow-500" : "text-gray-400"
              } hover:text-yellow-500 transition`}
            >
              {recipe.is_favorited ? "★" : "☆"}
            </button>
          )}
        </div>
      </div>
      {showActions && (
        <div className="bg-gray-50 px-4 py-3 flex justify-end space-x-2">
          <Link
            to={`/recipes/${recipe.id}/edit`}
            className="text-sm bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 transition"
          >
            Edit
          </Link>
          <button
            onClick={() => onDelete && onDelete(recipe.id)}
            className="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default RecipeCard;
