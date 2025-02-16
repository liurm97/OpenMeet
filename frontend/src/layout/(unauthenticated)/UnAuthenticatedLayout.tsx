import UnAuthenticatedHomePage from "@/pages/(unauthenticated)/UnAuthenticatedHomePage";
import { SignedOut } from "@clerk/clerk-react";
import { useAuth } from "@clerk/react-router";

const UnAuthenticatedLayout = () => {
  const user = useAuth();
  const { isLoaded, userId } = user;
  if (isLoaded) console.log(`userId:: ${userId}`);

  return (
    <SignedOut>
      <UnAuthenticatedHomePage />
    </SignedOut>
  );
};

export default UnAuthenticatedLayout;
