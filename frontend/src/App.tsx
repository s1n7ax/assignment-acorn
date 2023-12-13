import { QueryClient, QueryClientProvider } from "react-query";
import "./App.css";
import Review from "./Review/Review";

const client = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

function App() {
  return (
    <>
      <QueryClientProvider client={client}>
        <Review />
      </QueryClientProvider>
    </>
  );
}

export default App;
