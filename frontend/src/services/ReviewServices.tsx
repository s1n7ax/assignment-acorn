export interface IReview {
  id?: number;
  username: string;
  rating: number;
  comment: string;
}

export interface IReviewQuery {
  orderBy?: ReviewOrderBy;
  startDate?: string;
  endDate?: string;
  pageSize?: number;
  pageNo?: number;
}

export interface IReviewSummary {
  average: number;
}

export enum ReviewOrderBy {
  DATE = "date",
  RATING_HIGH = "rating_high",
  RATING_LOW = "rating_low",
}

export const createReview = async ({ username, rating, comment }: IReview) => {
  const response = await fetch("http://localhost:8080/v1/reviews", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      rating,
      comment,
    }),
  });

  if (response.status !== 201) {
    const error = await response.json();
    throw new Error(error?.message);
  }
};

export const getReviews = async ({
  signal,
  reviewQueries,
}: {
  signal: AbortSignal | undefined;
  reviewQueries: IReviewQuery;
}): Promise<Array<IReview>> => {
  const { orderBy = ReviewOrderBy.DATE } = reviewQueries || {};
  console.log(signal);

  const response = await fetch(
    "http://localhost:8080/v1/reviews?" +
      new URLSearchParams({
        order_by: orderBy,
      }),
    {
      signal,
    },
  );

  const data = await response.json();

  if (response.status !== 200) {
    throw new Error(data);
  }

  return data;
};

export const getReviewSummary = async (): Promise<IReviewSummary> => {
  const response = await fetch("http://localhost:8080/v1/reviews/summary");

  const data = await response.json();

  if (response.status != 200) {
    throw new Error(data.message);
  }

  return data;
};
