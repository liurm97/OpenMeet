import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, Pencil } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { updateSingleEventAgenda } from "@/utils/routeAction";
import { useNavigate } from "react-router-dom";

const EditEventNameDialog = ({
  eventName,
  eventId,
  setName,
}: {
  eventName: string;
  eventId: string;
  setName: React.Dispatch<string>;
}) => {
  const textRef = useRef<string>(eventName);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const handleUpdateEventName = async (text: string, eventId: string) => {
    try {
      setIsLoading(true);
      if (text.length <= 0) throw new Error("Event name cannot be empty!");

      // Update Event's "name" field
      const response = await updateSingleEventAgenda(text, "name", eventId);
      setName(response.new_event_name as string);
      navigate(0);
    } catch (e) {
      if (e instanceof Error) {
        toast(e.message);
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button>
          <Pencil size={16} />
          {/* <span>Agenda</span> */}
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="flex flex-row justify-center gap-4 items-center"></DialogHeader>
        <DialogTitle>Edit event name</DialogTitle>
        <div className="grid w-full gap-2">
          <Input
            type="text"
            defaultValue={textRef.current}
            onChange={(e) => (textRef.current = e.target.value)}
            placeholder="Type your agenda here."
            ref={(textRef) => textRef && textRef.focus()}
            onFocus={(e) =>
              e.currentTarget.setSelectionRange(
                e.currentTarget.value.length,
                e.currentTarget.value.length
              )
            }
          />
          {isLoading ? (
            <Button disabled className="bg-gray-400">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </Button>
          ) : (
            <Button
              onClick={() => handleUpdateEventName(textRef.current, eventId)}
              className="bg-black"
            >
              Submit
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditEventNameDialog;
