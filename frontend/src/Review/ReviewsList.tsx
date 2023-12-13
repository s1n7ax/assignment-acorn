import { useQuery } from "react-query";
import { ReviewOrderBy, getReviews } from "../services/ReviewServices";
import { useState, useTransition } from "react";

function ReviewsList() {
  const [orderBy, setOrderBy] = useState<ReviewOrderBy>(ReviewOrderBy.DATE);
  const [_isLoading, startTransition] = useTransition();

  const { data, isError, error } = useQuery({
    queryKey: ["reviews", orderBy],
    queryFn: ({ signal }) =>
      getReviews({
        signal,
        reviewQueries: { orderBy },
      }),
    suspense: true,
    useErrorBoundary: false,
    keepPreviousData: true,
  });

  if (isError) {
    console.error("Error occured while retrieving review details", error);
    return "Failed to retrieve data!";
  }

  if (!data || data?.length === 0) {
    return "No reviews available to display";
  }

  const changeOrder = (orderBy: ReviewOrderBy) => {
    startTransition(() => {
      setOrderBy(orderBy);
    });
  };

  return (
    <div>
      <label>Order By:</label>
      <button onClick={() => changeOrder(ReviewOrderBy.DATE)}>Date</button>
      <button onClick={() => changeOrder(ReviewOrderBy.RATING_HIGH)}>
        Highest Reviews
      </button>
      <button onClick={() => changeOrder(ReviewOrderBy.RATING_LOW)}>
        Lowerst Reviews
      </button>
      <table>
        <thead>
          <tr>
            <td>Username</td>
            <td>Rating</td>
            <td>Comment</td>
          </tr>
        </thead>
        <tbody>
          {data.map((review) => {
            return (
              <tr key={review.id}>
                <td>{review.username}</td>
                <td>{review.rating}</td>
                <td>{review.comment}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default ReviewsList;
