import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./pages/(shared)/ErrorPage";
import AvailabilityPage from "./pages/(shared)/AvailabilityPage";
import UnAuthenticatedLayout from "./layout/(unauthenticated)/UnAuthenticatedLayout";
import AuthenticatedLayout from "./layout/(authenticated)/AuthenticatedLayout";
import { fetchSingleEventData } from "./utils/routerAction";
// import AvailabilityTable from "./components/(shared)/AvailabilityTable";

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
    path: "/event/:eventId",
    element: <AvailabilityPage />,
    errorElement: <ErrorPage />,
    loader: async ({ params }) => fetchSingleEventData(params.eventId!),
  },
  // {
  //   path: "/table",
  //   element: <AvailabilityTable />,
  //   errorElement: <ErrorPage />,
  // },

  {
    path: "*",
    element: <ErrorPage />,
  },
]);

const App = () => {
  return <RouterProvider router={router}></RouterProvider>;
};

export default App;
