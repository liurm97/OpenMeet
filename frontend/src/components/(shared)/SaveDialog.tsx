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

const SaveDialog = ({ eventId }: { eventId: string }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [text, setText] = useState<string>("");
  const navigate = useNavigate();

  const handleSave = async (text: string, eventId: string) => {
    try {
      console.log("saving!");
      // navigate(0);
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
              onClick={() => handleSave(text, eventId)}
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
