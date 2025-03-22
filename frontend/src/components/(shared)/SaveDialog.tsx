import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { ADDUSERAVAILABILITY, AVAILABILITYSTATE } from "@/utils/constants";
import { EventTimeUTC } from "@/types/type";
import { formatAvailabilityBooleanToString } from "@/utils/formatter";
import { addEventRespondentAvailability } from "@/services/api/api";
import { useAuth } from "@clerk/clerk-react";

const SaveDialog = ({ eventId, type }: { eventId: string; type: number }) => {
  // useStates
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const auth = useAuth();
  const [text, setText] = useState<string>("");
  const navigate = useNavigate();

  const handleAddRespondentAvailbility = async (
    eventId: string,
    respondentName: string,
    respondentArray: boolean[][]
  ) => {
    try {
      if (respondentName.length < 1) {
        throw new Error("Respondent name cannot be empty!");
      }

      setIsLoading(true);
      console.log(eventId);
      console.log(respondentName);
      console.log(respondentArray);
      const availabilityState = JSON.parse(
        localStorage.getItem(`${AVAILABILITYSTATE}${eventId}`) as string
      );
      const formattedRespondentStringArray: EventTimeUTC[] =
        formatAvailabilityBooleanToString(
          type,
          respondentArray,
          availabilityState?.availability as string[][]
        );

      console.log(formattedRespondentStringArray);
      if (auth.isSignedIn) {
        await addEventRespondentAvailability(
          eventId,
          respondentName,
          formattedRespondentStringArray,
          false
        );
      } else {
        await addEventRespondentAvailability(
          eventId,
          respondentName,
          formattedRespondentStringArray,
          true
        );
      }
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
        <Button className="bg-white border-green-500 border text-green-500 hover:bg-green-100">
          <span>Save</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="flex flex-row justify-center gap-4 items-center"></DialogHeader>
        <DialogTitle>Saving as a guest respondent</DialogTitle>
        <div className="grid w-full gap-2">
          <Input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter your name here"
          />
          {isLoading ? (
            <Button disabled className="bg-gray-400">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </Button>
          ) : (
            <Button
              onClick={() => {
                const respondentName = text;
                const respondentArray = JSON.parse(
                  localStorage.getItem(
                    `${ADDUSERAVAILABILITY}${eventId}`
                  ) as string
                );
                handleAddRespondentAvailbility(
                  eventId,
                  respondentName,
                  respondentArray
                );
              }}
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

export default SaveDialog;
