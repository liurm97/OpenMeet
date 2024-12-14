import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./pages/(shared)/ErrorPage.tsx";
import UnAuthenticatedHomePage from "./pages/(unauthenticated)/UnAuthenticatedHomePage.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <UnAuthenticatedHomePage />,
    errorElement: <ErrorPage />,
  },
]);

createRoot(document.getElementById("root")!).render(
  // <ChakraProvider
  //   toastOptions={{ defaultOptions: { position: "bottom" } }}
  //   resetCSS={false}
  //   disableGlobalStyle={true}
  // >
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
  // </ChakraProvider>
);

// createRoot(document.getElementById("root")!).render(
//   <StrictMode>
//     <App />
//   </StrictMode>
// );
