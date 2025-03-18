import { Button } from "@/components/ui/button";
import { MessageSquareText } from "lucide-react";

const GiveFeedback = () => {
  return (
    <Button
      // variant="default"
      className="bg-black text-white hover:bg-gray-800 flex flex-row"
    >
      {" "}
      <MessageSquareText className="[@media(max-width:770px)]:block" />
      <span className="[@media(max-width:770px)]:hidden">Give feedback</span>
    </Button>
  );
};

export default GiveFeedback;
