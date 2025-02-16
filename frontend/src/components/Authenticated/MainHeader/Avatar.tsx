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

const Avatar = () => {
  /*
    Retrieve and render Avatar - Fullname in Google account profile
  */

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
          <SignOutButton>
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
