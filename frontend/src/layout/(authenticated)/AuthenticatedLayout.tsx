import { SignedIn, useAuth } from "@clerk/clerk-react";
import AuthenticatedHomePage from "../../pages/(authenticated)/AuthenticatedHomePage";
import { useNavigate } from "react-router-dom";

const AuthenticatedLayout = () => {
  /*
    Layout to render Authenticates pages/routes
    - if user is not signed in, redirect to non-authenticated homepage
    - if user is signed in, proceed to authenticated homepage
  */
  const auth = useAuth();
  const navigate = useNavigate();
  if (auth.isLoaded) {
    if (!auth.isSignedIn) {
      console.log("navigate to '/' page");
      setTimeout(navigate, 0, "/");
    }
  }
  return (
    <SignedIn>
      <AuthenticatedHomePage />
    </SignedIn>
  );
};

export default AuthenticatedLayout;
