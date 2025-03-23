import { Coffee } from "lucide-react";

const TreatCoffee = () => {
  return (
    <a
      href="https://buy.stripe.com/test_fZe4ineGhfCWabueUU"
      target="_blank"
      className="text-sm hover:text-gray-600 hover:underline hover:underline-offset-4 gap-1 flex flex-row items-center"
    >
      {" "}
      <Coffee className="[@media(max-width:770px)]:block" />{" "}
      <span className="[@media(max-width:770px)]:hidden">Treat coffee</span>
    </a>
  );
};

export default TreatCoffee;
