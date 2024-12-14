import { Link } from "react-router-dom";
import CalendarLogo from "../../assets/calendar_icon.svg?react";
import { Button } from "@/components/ui/button";

const UnAuthenticatedMainHeader = () => {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <CalendarLogo />
          <span className="font-semibold text-xl">OpenMeet</span>
        </Link>
        <nav className="flex items-center space-x-8">
          <Link to="#how-it-works" className="text-sm hover:text-gray-600">
            How it works
          </Link>
          <Link to="#faq" className="text-sm hover:text-gray-600">
            FAQ
          </Link>
          <Button
            variant="default"
            className="bg-black text-white hover:bg-gray-800"
          >
            Sign in
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default UnAuthenticatedMainHeader;
