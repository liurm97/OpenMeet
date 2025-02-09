import FAQ from "@/layout/(shared)/FAQ";
import Footer from "@/layout/(shared)/Footer";
import HowItWorks from "@/layout/(shared)/HowItWorks";
import UnAuthenticatedMainBody from "@/layout/(unauthenticated)/UnAuthenticatedMainBody";
import UnAuthenticatedMainHeader from "@/layout/(unauthenticated)/UnAuthenticatedMainHeader";

const UnAuthenticatedHomePage = () => {
  return (
    <div>
      <UnAuthenticatedMainHeader />
      <UnAuthenticatedMainBody />
      <HowItWorks />
      <FAQ />
      <Footer />
    </div>
  );
};

export default UnAuthenticatedHomePage;
