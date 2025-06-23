import { useEffect, useState } from 'react';
import { fetchRecipeReviews } from '../../services/reviews';
import ReviewCard from './ReviewCard';
import Loading from '../UI/Loading';
import Alert from '../UI/Alert';
import Pagination from '../UI/Pagination';

const ReviewList = ({ recipeId }) => {
  const [reviews, setReviews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const data = await fetchRecipeReviews(recipeId, currentPage);
        setReviews(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [recipeId, currentPage]);

  const handleReviewDeleted = () => {
    setCurrentPage(1); // Refresh to first page after deletion
  };

  if (loading && !reviews) return <Loading />;
  if (error) return <Alert message={error} type="error" />;

  return (
    <div>
      {reviews?.reviews?.length === 0 ? (
        <p className="text-gray-500 py-4">No reviews yet. Be the first to review!</p>
      ) : (
        <>
          <div className="space-y-4">
            {reviews?.reviews?.map((review) => (
              <ReviewCard 
                key={review.id} 
                review={review} 
                onDelete={handleReviewDeleted}
              />
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={reviews?.pages || 1}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
};

export default ReviewList;