import { Link } from "react-router-dom";
import Logo from "@/components/UnauthenticatedMainHeader/Logo";
import { Button } from "@/components/ui/button";

import { useGoogleLogin } from "@react-oauth/google";
import { googleLogout } from "@react-oauth/google";
import { useContext, useState } from "react";
// import HowItWorks from "@/components/UnauthenticatedMainHeader/HowItWorksLink";
// import FAQ from "@/components/UnauthenticatedMainHeader/FAQLink";
import HowItWorksLink from "@/components/UnauthenticatedMainHeader/HowItWorksLink";
import FAQLink from "@/components/UnauthenticatedMainHeader/FAQLink";
import SignIn from "@/components/__tests__/UnauthenticatedMainHeader/SignIn";
import { AuthContext } from "@/services/authentication/context";

const UnAuthenticatedMainHeader = () => {
  // states
  const [signInState, setSignInState] = useState<boolean>(false);
  const authContext = useContext(AuthContext);
  console.log(`authContext:: ${authContext}`);
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Logo />
        <nav className="flex items-center space-x-8">
          <HowItWorksLink />
          <FAQLink />
          {signInState == false ? <SignIn /> : <h1>Signed in</h1>}
        </nav>
      </div>
    </header>
  );
};

export default UnAuthenticatedMainHeader;
