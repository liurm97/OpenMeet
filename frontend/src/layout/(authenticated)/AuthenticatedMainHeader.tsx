import AddNewEventButton from "@/components/(shared)/AddNewEventButton";
import Logo from "@/components/(shared)/Logo";
import Avatar from "@/components/Authenticated/MainHeader/Avatar";
import GiveFeedback from "@/components/Authenticated/MainHeader/GiveFeedback";
import TreatCoffee from "@/components/Authenticated/MainHeader/TreatCoffee";

const AuthenticatedMainHeader = () => {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Logo />
        <nav className="flex items-center space-x-8">
          <GiveFeedback />
          <TreatCoffee />
          <AddNewEventButton />
          <Avatar />
        </nav>
      </div>
    </header>
  );
};

export default AuthenticatedMainHeader;
