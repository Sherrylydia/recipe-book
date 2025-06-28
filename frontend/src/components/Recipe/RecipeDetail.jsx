import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useRecipes } from '../../context/RecipeContext';
import { useAuth } from '../../context/AuthContext';
import Loading from '../UI/Loading';
import Alert from '../UI/Alert';
import ReviewList from '../Review/ReviewList';
import ReviewForm from '../Review/ReviewForm';
import { fetchRecipeReviews, createReview } from '../../services/reviews';

const RecipeDetail = () => {
  const { recipeId } = useParams();
  const { currentRecipe, getRecipe, loading, error } = useRecipes();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviews, setReviews] = useState(null);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsError, setReviewsError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    getRecipe(recipeId);
  }, [recipeId]);

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setReviewsLoading(true);
        const data = await fetchRecipeReviews(recipeId, currentPage);
        setReviews(data);
      } catch (err) {
        setReviewsError(err.message);
      } finally {
        setReviewsLoading(false);
      }
    };
    fetchReviews();
  }, [recipeId, currentPage]);

  // Handler to add review to state
  const handleReviewAdded = async (review) => {
    // Option 1: Refetch reviews (simple, always up-to-date)
    setCurrentPage(1); // Go to first page to see new review
    // Option 2: Optimistically update reviews (advanced)
    // setReviews((prev) => ({
    //   ...prev,
    //   reviews: [review, ...prev.reviews],
    //   total: prev.total + 1,
    // }));
  };

  // Handler to remove review from state
  const handleReviewDeleted = (deletedId) => {
    setReviews((prev) => ({
      ...prev,
      reviews: prev.reviews.filter((r) => r.id !== deletedId),
      total: prev.total - 1,
    }));
  };

  if (loading) return <Loading />;
  if (error) return <Alert message={error} type="error" />;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{currentRecipe?.title}</h1>
            <p className="text-gray-600 mt-2">
              By{' '}
              <Link 
                to={`/users/${currentRecipe?.author?.id}`} 
                className="text-indigo-600 hover:underline"
              >
                {currentRecipe?.author?.username}
              </Link>
            </p>
          </div>
          {user?.id === currentRecipe?.author?.id && (
            <div className="flex space-x-2">
              <Link
                to={`/recipes/${recipeId}/edit`}
                className="bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700 transition"
              >
                Edit
              </Link>
            </div>
          )}
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">Description</h2>
          <p className="text-gray-700">
            {currentRecipe?.description || 'No description provided'}
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">Ingredients</h2>
          <ul className="space-y-2">
            {currentRecipe?.ingredients?.map((ingredient, index) => (
              <li key={index} className="flex items-center">
                <span className="w-5 h-5 bg-indigo-100 rounded-full flex items-center justify-center mr-2">
                  <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                </span>
                <span>
                  {ingredient.amount && `${ingredient.amount} of `}
                  {ingredient.name}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2 text-gray-800">Instructions</h2>
          <div className="prose max-w-none">
            {currentRecipe?.instructions?.split('\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Reviews</h2>
          {user && (
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700 transition"
            >
              {showReviewForm ? 'Cancel' : 'Add Review'}
            </button>
          )}
        </div>

        {showReviewForm && (
          <div className="mb-6">
            <ReviewForm
              onReviewAdded={handleReviewAdded}
              setReviews={setReviews}
              recipeId={recipeId}
              setShowReviewForm={setShowReviewForm}
            />
          </div>
        )}

        <ReviewList
          reviews={reviews}
          loading={reviewsLoading}
          error={reviewsError}
          onDelete={handleReviewDeleted}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default RecipeDetail;