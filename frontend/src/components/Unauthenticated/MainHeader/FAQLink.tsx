import { Link } from "react-router-dom";

const FAQLink = () => {
  return (
    <Link to="#faq" className="text-sm hover:text-gray-600">
      <span aria-label="span-FAQ">FAQ</span>
    </Link>
  );
};

export default FAQLink;
