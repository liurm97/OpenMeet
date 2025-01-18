import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./pages/(shared)/ErrorPage.tsx";
import UnAuthenticatedHomePage from "./pages/(unauthenticated)/UnAuthenticatedHomePage.tsx";
import UnAuthenticatedAvailabilityPage from "./pages/(unauthenticated)/UnAuthenticatedAvailabilityPage.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <UnAuthenticatedHomePage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/events/:eventId",
    element: <UnAuthenticatedAvailabilityPage />,
    errorElement: <ErrorPage />,
  },

  {
    path: "/-/notfound",
    element: <ErrorPage />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
