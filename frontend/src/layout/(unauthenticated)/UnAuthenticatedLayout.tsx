import UnAuthenticatedHomePage from "@/pages/(unauthenticated)/UnAuthenticatedHomePage";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import { useAuth, useUser } from "@clerk/react-router";

const UnAuthenticatedLayout = () => {
  const user = useAuth();
  const { isLoaded, isSignedIn, userId } = user;
  if (isLoaded) console.log(`userId:: ${userId}`);

  return (
    <SignedOut>
      <UnAuthenticatedHomePage />
    </SignedOut>
  );
};

export default UnAuthenticatedLayout;
