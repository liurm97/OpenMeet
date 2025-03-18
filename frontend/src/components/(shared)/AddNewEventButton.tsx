import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const AddNewEventButton = () => {
  return (
    <Button
      // variant="default"
      className="bg-black text-white hover:bg-gray-800 flex flex-row"
    >
      {" "}
      <Plus /> <span className="[@media(max-width:770px)]:hidden">Event</span>
    </Button>
  );
};

export default AddNewEventButton;
