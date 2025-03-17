import { Link } from "react-router-dom";
import CalendarLogo from "../../assets/calendar_icon.svg?react";
const Logo = ({ isSignedIn }: { isSignedIn?: boolean }) => {
  return (
    <Link
      to={isSignedIn ? "/home" : "/"}
      className="flex items-center space-x-2"
    >
      <CalendarLogo />
      <span className="font-semibold text-xl">OpenMeet</span>
    </Link>
  );
};

export default Logo;
