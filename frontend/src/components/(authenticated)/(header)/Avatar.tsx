import { Button } from "@/components/ui/button";
import { SignOutButton } from "@clerk/clerk-react";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAuth, useUser } from "@clerk/react-router";
import { UserResource } from "@clerk/types";
import { useLocation } from "react-router-dom";

const Avatar = () => {
  /*
    Retrieve and render Avatar - Fullname in Google account profile
  */
  // Check if user is currently at Event availability page
  const pathname = useLocation().pathname;
  const availabilityPageRegex = /event\/[0-9a-z-]+/g;

  // Redirect to homepage if user is not at Event availability page
  const shouldRedirectToHomePage = !pathname.match(availabilityPageRegex);

  const auth = useAuth();
  const user = useUser();
  let fullName = null;

  if (auth.isLoaded) {
    const userResource: UserResource = user.user!;
    fullName = userResource.fullName!;
  }

  return (
    <Popover>
      <PopoverTrigger>
        <Badge variant={"outline"}> {fullName}</Badge>
      </PopoverTrigger>
      <PopoverContent className="w-40">
        <div className="flex items-center justify-center">
          <SignOutButton
            redirectUrl={shouldRedirectToHomePage ? "/" : `${pathname}`}
          >
            <Button variant={"default"} size={"sm"}>
              Sign Out
            </Button>
          </SignOutButton>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Avatar;
