import Logo from "@/components/(shared)/Logo";
import HowItWorksLink from "@/components/Unauthenticated/MainHeader/HowItWorksLink";
import FAQLink from "@/components/Unauthenticated/MainHeader/FAQLink";
import ClerkSignIn from "@/components/Unauthenticated/MainHeader/ClerkSignIn";

const UnAuthenticatedMainHeader = ({
  howItWorksRef,
  faqRef,
}: {
  howItWorksRef: React.MutableRefObject<HTMLDivElement | null>;
  faqRef: React.MutableRefObject<HTMLDivElement | null>;
}) => {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Logo />
        <nav className="flex items-center space-x-8">
          <HowItWorksLink howItWorksRef={howItWorksRef} />
          <FAQLink faqRef={faqRef} />
          <ClerkSignIn />
        </nav>
      </div>
    </header>
  );
};

export default UnAuthenticatedMainHeader;
