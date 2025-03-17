import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./pages/ErrorPage";
import AvailabilityPage from "./pages/AvailabilityPage";
import { fetchSingleEventData } from "./utils/routerAction";
import HomePage from "./pages/HomePage";

// Router
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/home",
    element: <HomePage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/event/:eventId",
    element: <AvailabilityPage />,
    errorElement: <ErrorPage />,
    loader: async ({ params }) => fetchSingleEventData(params.eventId!),
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
]);

const App = () => {
  return <RouterProvider router={router}></RouterProvider>;
};

export default App;
