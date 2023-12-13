import { Suspense } from "react";
import ReviewForm from "./ReviewForm";
import ReviewsList from "./ReviewsList";
import Loading from "./Loading";
import ReviewSummary from "./ReviewSummary";

function Review() {
	return (
		<div>
			<ReviewForm />
			<Suspense fallback={<Loading />}>
				<ReviewSummary />
				<ReviewsList />
			</Suspense>
		</div>
	);
}

export default Review;
