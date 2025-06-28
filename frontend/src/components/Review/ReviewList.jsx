import ReviewCard from "./ReviewCard";
import Loading from "../UI/Loading";
import Alert from "../UI/Alert";
import Pagination from "../UI/Pagination";

const ReviewList = ({
  reviews,
  loading,
  error,
  onDelete,
  currentPage,
  setCurrentPage,
}) => {
  if (loading && !reviews) return <Loading />;
  if (error) return <Alert message={error} type="error" />;

  return (
    <div>
      {reviews?.reviews?.length === 0 ? (
        <p className="text-gray-500 py-4">
          No reviews yet. Be the first to review!
        </p>
      ) : (
        <>
          <div className="space-y-4">
            {reviews?.reviews?.map((review) => (
              <ReviewCard key={review.id} review={review} onDelete={onDelete} />
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
