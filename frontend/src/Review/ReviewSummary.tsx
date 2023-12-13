import { useQuery } from "react-query";
import { getReviewSummary } from "../services/ReviewServices";

function Review() {
	const { data, isError, error } = useQuery({
		queryKey: ["review-summary"],
		queryFn: () => getReviewSummary(),
		suspense: true,
		useErrorBoundary: false,
		keepPreviousData: true,
	});

	if (isError) {
		console.error("Error occured while retrieving review summary", error);
		return "Failed to retrieve review summary!";
	}

	if (!data) {
		return "No review summary to display";
	}

	return <div>Rating: {data.average}</div>;
}

export default Review;
