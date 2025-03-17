import { SignedIn, SignedOut, useUser } from "@clerk/clerk-react";
import { useEffect, useRef } from "react";
import Header from "@/components/(shared)/Header";
import FAQ from "@/components/(unauthenticated)/MainBody/FAQ";
import Footer from "@/layout/(shared)/Footer";
import HowItWorks from "@/components/(unauthenticated)/MainBody/HowItWorks";
import MainBody from "@/layout/(shared)/MainBody";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  console.log("HomePage reloaded");
  const navigate = useNavigate();
  const { isSignedIn } = useUser();

  // Authenticated user to "/home"
  // Non-authenticated user to "/"
  useEffect(() => {
    if (isSignedIn) navigate("/home");
    else navigate("/");
  }, []);

  const howItWorksRef = useRef<HTMLDivElement | null>(null);
  const faqRef = useRef<HTMLDivElement | null>(null);
  return (
    <>
      {/* If current user is signed out */}
      <SignedOut>
        <Header howItWorksRef={howItWorksRef} faqRef={faqRef} />
        <MainBody />
        <HowItWorks howItWorksRef={howItWorksRef} />
        <FAQ faqRef={faqRef} />
        <Footer />
      </SignedOut>

      {/* If current user is signed in */}
      <SignedIn>
        <Header />
        <MainBody />
      </SignedIn>
    </>
  );
};

export default HomePage;
