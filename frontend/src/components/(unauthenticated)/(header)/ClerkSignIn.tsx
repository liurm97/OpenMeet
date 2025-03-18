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
import { useLocation } from "react-router-dom";

const ClerkSignIn = () => {
  // Check if user is currently at Event availability page
  const pathname = useLocation().pathname;
  const availabilityPageRegex = /event\/[0-9a-z-]+/g;

  // Redirect to homepage if user is not at Event availability page
  const shouldRedirectToHomePage = !pathname.match(availabilityPageRegex);

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
          <SignIn
            forceRedirectUrl={
              shouldRedirectToHomePage ? "/home" : `${pathname}`
            }
          />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default ClerkSignIn;
