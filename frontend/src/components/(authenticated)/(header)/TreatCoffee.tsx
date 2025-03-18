import { Coffee } from "lucide-react";

const TreatCoffee = () => {
  return (
    <button className="text-sm hover:text-gray-600 hover:underline hover:underline-offset-4 gap-1 flex flex-row items-center">
      {" "}
      <Coffee className="[@media(max-width:770px)]:block" />{" "}
      <span className="[@media(max-width:770px)]:hidden">Treat coffee</span>
    </button>
  );
};

export default TreatCoffee;
