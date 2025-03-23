import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { removeEventRespondentAvailability } from "@/services/api/api";

const BinDialog = ({
  eventId,
  respondentName,
  respondentId,
}: {
  eventId: string;
  respondentName: string;
  respondentId: string;
}) => {
  /*
    Component to confirm respondent deletion
  */

  // States
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Hooks
  const navigate = useNavigate();

  // Handler functions
  const handleRemoveRespondent = async (
    eventId: string,
    respondentId: string
  ) => {
    try {
      setIsLoading(true);
      await removeEventRespondentAvailability(eventId, respondentId);
      localStorage.clear();
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
        <button className=" bg-white hover:bg-white hidden group-hover:block">
          <Trash2 size={16} className="text-gray-500" />
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="flex flex-row justify-center gap-4 items-center"></DialogHeader>
        <DialogTitle>
          Are you sure you want to delete{" "}
          <span className="underline underline-offset-4">{respondentName}</span>
        </DialogTitle>
        <div className="grid w-full gap-2">
          {isLoading ? (
            <Button disabled className="bg-gray-400">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Deleting...
            </Button>
          ) : (
            <Button
              onClick={() => {
                handleRemoveRespondent(eventId, respondentId);
              }}
              className="bg-black"
            >
              Confirm
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BinDialog;
