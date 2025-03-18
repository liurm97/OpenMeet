import { useUser } from "@clerk/react-router";
import Logo from "@/components/(shared)/Logo";
import GiveFeedback from "@/components/(authenticated)/(header)/GiveFeedback";
import TreatCoffee from "@/components/(authenticated)/(header)/TreatCoffee";
import AddNewEventButton from "@/components/(shared)/AddNewEventButton";
import Avatar from "@/components/(authenticated)/(header)/Avatar";
import HowItWorksLink from "@/components/(unauthenticated)/(header)/HowItWorksLink";
import FAQLink from "@/components/(unauthenticated)/(header)/FAQLink";
import ClerkSignIn from "@/components/(unauthenticated)/(header)/ClerkSignIn";
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

  // Regex to check if user has arrived at the Event availability page
  const availabilityPageRegex = /event\/[0-9a-z-]+/g;
  const shouldRenderSecondaryHeader = pathname.match(availabilityPageRegex);

  return shouldRenderSecondaryHeader ? (
    <header className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Logo isSignedIn={isSignedIn} />
        <nav className="flex items-center gap-4 [@media(max-width:550px)]:gap-1">
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
          {isSignedIn && <Avatar />}

          {!isSignedIn && <ClerkSignIn />}
        </nav>
      </div>
    </header>
  );
};

export default Header;
