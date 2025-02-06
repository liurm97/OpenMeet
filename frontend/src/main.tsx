import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./pages/(shared)/ErrorPage.tsx";
import UnAuthenticatedHomePage from "./pages/(unauthenticated)/UnAuthenticatedHomePage.tsx";
import UnAuthenticatedAvailabilityPage from "./pages/(unauthenticated)/UnAuthenticatedAvailabilityPage.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import * as client_secret from "/Users/bobby/uol/final_project/dev/OpenMeet/frontend/client_secret.json";

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

const clientId = client_secret.web.client_id;

console.log(`clientId:: ${clientId}`);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <RouterProvider router={router} />
    </GoogleOAuthProvider>
  </StrictMode>
);
