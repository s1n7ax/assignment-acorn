import { useMutation, useQueryClient } from "react-query";
import { createReview } from "../services/ReviewServices";
import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useState,
  useTransition,
} from "react";

function ReviewForm() {
  const [username, setUsername] = useState("");
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [_isInTransition, startTransition] = useTransition();

  const queryClient = useQueryClient();

  const { mutate: postReview, isLoading } = useMutation({
    mutationFn: createReview,
    onError: (error) => {
      window.alert("Error occured" + error);
    },
    onSuccess: () => {
      console.log("success");
      queryClient.invalidateQueries("reviews");
      queryClient.invalidateQueries("review-summary");

      setUsername("");
      setRating(1);
      setComment("");
    },
  });

  const shouldEnableSubmit = useCallback(() => {
    if (username === "") {
      return false;
    }
    return true;
  }, [username]);

  const checkErrors = (currenUsername: string) => {
    if (currenUsername === "") {
      setErrorMessage("Hey!, you need to set the username");
    } else if (currenUsername.match(/^[a-zA-Z]+$/) === null) {
      setErrorMessage("Username should be only [a-z] characters");
    } else {
      setErrorMessage("");
    }
  };

  const onUsernameChange = (ev: ChangeEvent<HTMLInputElement>) => {
    const evUsername = ev.target.value;
    setUsername(evUsername);

    startTransition(() => {
      checkErrors(evUsername);
    });
  };

  const onSubmit = (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    const form = new FormData(ev.currentTarget);

    const username = form.get("username")?.toString() || "";
    const rating = form.get("rating")?.toString() || "";
    const comment = form.get("comment")?.toString() || "";

    const data = {
      username: username,
      rating: Number.parseInt(rating),
      comment: comment,
    };

    postReview(data);
  };

  return (
    <form onSubmit={onSubmit}>
      <div>
        <label>Username: </label>
        <input
          type="text"
          name="username"
          value={username}
          onChange={onUsernameChange}
          onFocus={() => checkErrors(username)}
        />
      </div>

      <div>
        <label>Rating: </label>
        <select
          name="rating"
          value={rating}
          onChange={(ev) => setRating(Number.parseInt(ev.target.value))}
        >
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
      </div>

      <div>
        <label>Comment: </label>
        <textarea
          name="comment"
          value={comment}
          onChange={(ev) => setComment(ev.target.value)}
        ></textarea>
      </div>
      <div>
        <input
          disabled={isLoading || !shouldEnableSubmit()}
          type="submit"
          value="Add Review"
        />
      </div>
      <div id="error-message">{errorMessage}</div>
    </form>
  );
}

export default ReviewForm;
