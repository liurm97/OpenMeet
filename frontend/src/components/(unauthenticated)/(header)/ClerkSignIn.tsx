import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { SignIn } from "@clerk/clerk-react";

const ClerkSignIn = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="default"
          className="bg-black text-white hover:bg-gray-800"
        >
          Sign in
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="flex flex-row justify-center gap-4 items-center">
          <VisuallyHidden>
            <DialogTitle>Sign in</DialogTitle>
            <DialogDescription>Google sign in button</DialogDescription>
          </VisuallyHidden>
          <SignIn forceRedirectUrl={"/home"} />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default ClerkSignIn;
