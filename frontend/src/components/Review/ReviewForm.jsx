import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchRecipeReviews, createReview } from '../../services/reviews';
import { useAuth } from '../../context/AuthContext';
import Alert from '../UI/Alert';

const ReviewForm = ({ onReviewAdded, setReviews, recipeId, setShowReviewForm }) => {
  const { token } = useAuth();
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await createReview({
        recipe_id: recipeId,
        rating,
        content,
      }, token);

      // Option 1: Refetch reviews for latest data
      if (setReviews) {
        const data = await fetchRecipeReviews(recipeId, 1);
        setReviews(data);
      }

      setContent('');
      setRating(5);
      if (onReviewAdded) onReviewAdded(res.review);
      if (setShowReviewForm) setShowReviewForm(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Write a Review</h3>
      
      {error && <Alert message={error} type="error" className="mb-4" />}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Rating</label>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-2xl ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
              >
                ★
              </button>
            ))}
          </div>
        </div>
        
        <div className="mb-4">
          <label htmlFor="content" className="block text-gray-700 font-medium mb-2">
            Review
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="3"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;