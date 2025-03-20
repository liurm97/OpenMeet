import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { updateSingleEventAgenda } from "@/utils/routeAction";
import { useNavigate } from "react-router-dom";

const AgendaDialog = ({
  eventAgenda,
  eventId,
  setAgenda,
}: {
  eventAgenda: string;
  eventId: string;
  setAgenda: React.Dispatch<string>;
}) => {
  const dialogAction = eventAgenda === "" ? "Add" : "Edit";
  const textRef = useRef<string>(eventAgenda);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const handleUpdateAgenda = async (text: string, eventId: string) => {
    try {
      setIsLoading(true);
      if (text.length <= 0) throw new Error("Agenda cannot be empty!");

      // Update Event's "agenda" field
      const response = await updateSingleEventAgenda(text, "agenda", eventId);
      setAgenda(response.new_agenda as string);
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
        <button className="mt-2 text-black hover:underline flex items-center space-x-1">
          {dialogAction === "Adding" ? (
            <Plus size={16} />
          ) : (
            <Pencil size={16} />
          )}
          <span>Agenda</span>
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="flex flex-row justify-center gap-4 items-center"></DialogHeader>
        <DialogTitle>{dialogAction} agenda</DialogTitle>
        <div className="grid w-full gap-2">
          <Textarea
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
              onClick={() => handleUpdateAgenda(textRef.current, eventId)}
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

export default AgendaDialog;
