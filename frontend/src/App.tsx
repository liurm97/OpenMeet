import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./pages/(shared)/ErrorPage";
import AvailabilityPage from "./pages/(shared)/AvailabilityPage";
import UnAuthenticatedLayout from "./layout/(unauthenticated)/UnAuthenticatedLayout";
import AuthenticatedLayout from "./layout/(authenticated)/AuthenticatedLayout";

// Router
const router = createBrowserRouter([
  {
    path: "/",
    element: <UnAuthenticatedLayout />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/home",
    element: <AuthenticatedLayout />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/event/:eventid",
    element: <AvailabilityPage />,
    errorElement: <ErrorPage />,
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
