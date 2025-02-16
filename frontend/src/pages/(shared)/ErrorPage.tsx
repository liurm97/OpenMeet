import { useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
  /*
  Error page
  - Automatically redirect user to Unauthenticated homepage if not signed in
  - Automatically redirect user to Authenticated homepage if signed in
  */

  const auth = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (auth.isSignedIn === true) {
      setTimeout(navigate, 1000, "/home");
    }
    if (auth.isSignedIn === false) {
      setTimeout(navigate, 1000, "/");
    }
  });

  return (
    <div className="flex flex-col justify-center items-center text-2xl">
      <h1>404 Not Found</h1>
      <h1>The page does not exist</h1>
      <h1>Redirecting you to Homepage...</h1>
    </div>
  );
};

export default ErrorPage;
