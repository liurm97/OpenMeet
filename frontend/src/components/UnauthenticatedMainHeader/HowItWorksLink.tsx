import { Link } from "react-router-dom";

const HowItWorksLink = () => {
  return (
    <Link
      to="#how-it-works"
      className="text-sm hover:text-gray-600 how-it-works"
    >
      How it works
    </Link>
  );
};

export default HowItWorksLink;
