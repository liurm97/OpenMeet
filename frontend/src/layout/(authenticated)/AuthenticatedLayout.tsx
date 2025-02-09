import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import AuthenticatedHomePage from "../../pages/(authenticated)/AuthenticatedHomePage";

const AuthenticatedLayout = () => {
  return (
    <SignedIn>
      <AuthenticatedHomePage />
    </SignedIn>
  );
};

export default AuthenticatedLayout;
