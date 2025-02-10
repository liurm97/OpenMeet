import FAQ from "@/layout/(shared)/FAQ";
import Footer from "@/layout/(shared)/Footer";
import HowItWorks from "@/layout/(shared)/HowItWorks";
import UnAuthenticatedMainBody from "@/layout/(unauthenticated)/UnAuthenticatedMainBody";
import UnAuthenticatedMainHeader from "@/layout/(unauthenticated)/UnAuthenticatedMainHeader";
import { useRef } from "react";

const UnAuthenticatedHomePage = () => {
  const howItWorksRef = useRef<HTMLDivElement | null>(null);
  const faqRef = useRef<HTMLDivElement | null>(null);
  return (
    <div>
      <UnAuthenticatedMainHeader
        howItWorksRef={howItWorksRef}
        faqRef={faqRef}
      />
      <UnAuthenticatedMainBody />
      <HowItWorks howItWorksRef={howItWorksRef} />
      <FAQ faqRef={faqRef} />
      <Footer />
    </div>
  );
};

export default UnAuthenticatedHomePage;
