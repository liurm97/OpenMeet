import { Link } from "react-router-dom";
import CalendarLogo from "../../assets/calendar_icon.svg?react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useGoogleLogin } from "@react-oauth/google";
import { googleLogout } from "@react-oauth/google";
import { useState } from "react";

const UnAuthenticatedMainHeader = () => {
  const [signInState, setSignInState] = useState<boolean>(false);

  const login = useGoogleLogin({
    onSuccess: (successResponse) => {
      const accessToken = successResponse.access_token;
      console.log(`accessToken:: ${accessToken}`);
      setSignInState(true);
    },
    onError: (errorResponse) => {
      console.log(`Failed\nerrorResponse::${JSON.stringify(errorResponse)}`);
    },
  });

  // states

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <CalendarLogo />
          <span className="font-semibold text-xl">OpenMeet</span>
        </Link>
        <nav className="flex items-center space-x-8">
          <Link to="#how-it-works" className="text-sm hover:text-gray-600">
            How it works
          </Link>
          <Link to="#faq" className="text-sm hover:text-gray-600">
            FAQ
          </Link>
          {signInState == false ? (
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
                <DialogHeader>
                  <DialogTitle>Sign in</DialogTitle>
                  <Button onClick={() => login()}>Continue With Google</Button>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          ) : (
            <h1>Signed in</h1>
          )}
          {/* <Button
            variant="default"
            className="bg-black text-white hover:bg-gray-800"
            onClick={() => {

            }}
          >
            Sign in
          </Button> */}
        </nav>
      </div>
    </header>
  );
};

export default UnAuthenticatedMainHeader;
