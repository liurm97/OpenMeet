import { SignedIn, SignedOut, useUser } from "@clerk/clerk-react";
import { useEffect, useRef } from "react";
import Header from "@/components/(shared)/Header";
import FAQ from "@/components/(unauthenticated)/(mainbody)/FAQ";
import Footer from "@/layout/(shared)/Footer";
import HowItWorks from "@/components/(unauthenticated)/(mainbody)/HowItWorks";
import MainBody from "@/layout/(shared)/MainBody";
import { useNavigate } from "react-router-dom";
import { Toaster } from "sonner";
const HomePage = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useUser();

  // Authenticated user to "/home" & save userid in localstorage
  // Non-authenticated user to "/" and clear userid in localstorage
  useEffect(() => {
    if (isSignedIn) {
      navigate("/home");
    } else {
      navigate("/");
    }
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
        <Header howItWorksRef={howItWorksRef} faqRef={faqRef} />
        <MainBody />
        <HowItWorks howItWorksRef={howItWorksRef} />
        <FAQ faqRef={faqRef} />
        <Footer />
      </SignedIn>
      <Toaster />
    </>
  );
};

export default HomePage;
