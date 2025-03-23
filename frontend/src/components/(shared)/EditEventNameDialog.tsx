import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Loader2, Pencil } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { updateSingleEventAgenda } from "@/utils/routeAction";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";

const EditEventNameDialog = ({
  owner,
  eventName,
  eventId,
  setName,
}: {
  owner: string;
  eventName: string;
  eventId: string;
  setName: React.Dispatch<string>;
}) => {
  // States
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Hooks
  const auth = useAuth();
  const navigate = useNavigate();

  // Variables

  const allowedToEditEventname =
    owner === "-1"
      ? true
      : auth.isSignedIn && `${auth.userId}:${eventId}` == owner
      ? true
      : false;

  // Refs
  const textRef = useRef<string>(eventName);

  // Handler functions
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
      <DialogTrigger disabled={allowedToEditEventname ? false : true} asChild>
        <button>
          {allowedToEditEventname ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  {" "}
                  <Pencil size={16} />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Edit event name</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  {" "}
                  <Pencil
                    size={16}
                    className={`${
                      allowedToEditEventname
                        ? undefined
                        : "cursor-not-allowed disabled text-gray-400"
                    }`}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>You must be owner of the event to edit event name</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
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
