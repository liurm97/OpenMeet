import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SignOutButton } from "@clerk/clerk-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

const Avatar = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <SignOutButton>
          <Button className="bg-black text-white hover:bg-gray-800">
            Sign Out
          </Button>
        </SignOutButton>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="flex flex-row justify-center gap-4 items-center">
          <VisuallyHidden>
            <DialogTitle>Sign in</DialogTitle>
            <DialogDescription>Google sign in button</DialogDescription>
          </VisuallyHidden>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default Avatar;
