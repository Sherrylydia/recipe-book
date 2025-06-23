import { useAuth } from '../../context/AuthContext';
import { deleteReview } from '../../services/reviews';

const ReviewCard = ({ review, onDelete }) => {
  const { user } = useAuth();

  const handleDelete = async () => {
    try {
      await deleteReview(review.id);
      if (onDelete) onDelete();
    } catch (err) {
      console.error('Error deleting review:', err);
    }
  };

  return (
    <div className="border-b border-gray-200 py-4">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-semibold text-gray-800">{review.user?.username}</h4>
          <div className="flex items-center mt-1">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={`text-lg ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
              >
                ★
              </span>
            ))}
            <span className="text-sm text-gray-500 ml-2">
              {new Date(review.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
        {user?.id === review.user?.id && (
          <button
            onClick={handleDelete}
            className="text-red-500 hover:text-red-700 text-sm"
          >
            Delete
          </button>
        )}
      </div>
      <p className="mt-2 text-gray-700">{review.content}</p>
    </div>
  );
};

export default ReviewCard;