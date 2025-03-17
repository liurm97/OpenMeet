import { useUser } from "@clerk/react-router";
import Logo from "@/components/(shared)/Logo";
import GiveFeedback from "@/components/(authenticated)/Header/GiveFeedback";
import TreatCoffee from "@/components/(authenticated)/Header/TreatCoffee";
import AddNewEventButton from "@/components/(shared)/AddNewEventButton";
import Avatar from "@/components/(authenticated)/Header/Avatar";
import HowItWorksLink from "@/components/(unauthenticated)/Header/HowItWorksLink";
import FAQLink from "@/components/(unauthenticated)/Header/FAQLink";
import ClerkSignIn from "@/components/(unauthenticated)/Header/ClerkSignIn";
import { useLocation } from "react-router-dom";

const Header = ({
  howItWorksRef,
  faqRef,
}: {
  howItWorksRef?: React.MutableRefObject<HTMLDivElement | null>;
  faqRef?: React.MutableRefObject<HTMLDivElement | null>;
}) => {
  // check if user is signed in
  const { isSignedIn } = useUser();
  const pathname = useLocation().pathname;

  // If user is currently signed in or has arrived at Event availability page
  const shouldRenderSecondaryHeader = isSignedIn || pathname.includes("/event");

  return shouldRenderSecondaryHeader ? (
    <header className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Logo isSignedIn={isSignedIn} />
        <nav className="flex items-center space-x-8">
          <GiveFeedback />
          <TreatCoffee />
          <AddNewEventButton />

          {/* If user arrives on Event AvailabilityPage and is signed in */}
          {isSignedIn && <Avatar />}

          {/* If user arrives on Event AvailabilityPage but is not signed in */}
          {!isSignedIn && <ClerkSignIn />}
        </nav>
      </div>
    </header>
  ) : (
    <header className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Logo />
        <nav className="flex items-center space-x-8">
          <HowItWorksLink howItWorksRef={howItWorksRef!} />
          <FAQLink faqRef={faqRef!} />
          <ClerkSignIn />
        </nav>
      </div>
    </header>
  );
};

export default Header;
