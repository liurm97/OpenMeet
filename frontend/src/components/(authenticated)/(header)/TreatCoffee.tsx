import { Button } from "@/components/ui/button";
import { Coffee } from "lucide-react";

const TreatCoffee = () => {
  return (
    <Button
      // variant="default"
      className="bg-black text-white hover:bg-gray-800 flex flex-row"
    >
      {" "}
      <Coffee className="[@media(max-width:770px)]:block" />{" "}
      <span className="[@media(max-width:770px)]:hidden">Treat coffee</span>
    </Button>
  );
};

export default TreatCoffee;
