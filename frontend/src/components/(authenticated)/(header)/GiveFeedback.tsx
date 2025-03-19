import { MessageSquareText } from "lucide-react";

const GiveFeedback = () => {
  return (
    <button className="text-sm hover:text-gray-600 hover:underline hover:underline-offset-4 gap-1 flex flex-row items-center pt-1">
      {" "}
      <MessageSquareText className="[@media(max-width:770px)]:block" />
      <span className="[@media(max-width:770px)]:hidden">Give feedback</span>
    </button>
  );
};

export default GiveFeedback;
