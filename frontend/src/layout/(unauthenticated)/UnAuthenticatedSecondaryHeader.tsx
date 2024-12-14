import { Link } from "react-router-dom";
import CalendarLogo from "../../assets/calendar_icon.svg?react";
import { Coffee, MessageSquare, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const UnAuthenticatedSecondaryHeader = () => {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <CalendarLogo />
          <span className="font-semibold text-xl">OpenMeet</span>
        </Link>

        <div className="flex items-center space-x-6">
          <Link
            to="/feedback"
            className="text-sm hover:text-gray-600 flex items-center space-x-2"
          >
            <MessageSquare className="h-4 w-4" />
            <span>Give feedback</span>
          </Link>
          <Link
            to="/coffee"
            className="text-sm hover:text-gray-600 flex items-center space-x-2"
          >
            <Coffee className="h-4 w-4" />
            <span>Treat coffee</span>
          </Link>
          <Button
            variant="default"
            className="bg-black text-white hover:bg-gray-800"
          >
            <Plus className="h-4 w-4 mr-2" />
            New event
          </Button>
          <Button
            variant="default"
            className="bg-black text-white hover:bg-gray-800"
          >
            Sign in
          </Button>
        </div>
      </div>
    </header>
  );
};

export default UnAuthenticatedSecondaryHeader;
