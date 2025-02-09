import { createBrowserRouter, RouterProvider } from "react-router-dom";
import UnAuthenticatedHomePage from "./pages/(unauthenticated)/UnAuthenticatedHomePage";
import ErrorPage from "./pages/(shared)/ErrorPage";
import AvailabilityPage from "./pages/(shared)/AvailabilityPage";

// Router

const router = createBrowserRouter([
  {
    path: "/",
    element: <UnAuthenticatedHomePage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/event/:eventid",
    element: <AvailabilityPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/-/notfound",
    element: <ErrorPage />,
  },
]);

const App = () => {
  return <RouterProvider router={router}></RouterProvider>;
};

export default App;
