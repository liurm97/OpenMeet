import { Link } from "react-router-dom";
import CalendarLogo from "../../assets/calendar_icon.svg?react";
const Logo = () => {
  return (
    <Link to="/" className="flex items-center space-x-2">
      <CalendarLogo />
      <span className="font-semibold text-xl">OpenMeet</span>
    </Link>
  );
};

export default Logo;
