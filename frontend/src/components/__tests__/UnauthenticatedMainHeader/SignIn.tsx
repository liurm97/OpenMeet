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
import GoogleButton from "react-google-button";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

// export const useSignIn = (
//   setSignInState: React.Dispatch<React.SetStateAction<boolean>>
// ) => {
//   useGoogleLogin({
//     onSuccess: (successResponse) => {
//       const accessToken = successResponse.access_token;
//       console.log(`accessToken:: ${accessToken}`);
//       setSignInState(true);
//     },
//     onError: (errorResponse) => {
//       console.log(`Failed\nerrorResponse::${JSON.stringify(errorResponse)}`);
//     },
//   });
// };

const GoogleSignInButton = () => {
  //   const login = useGoogleLogin({
  //     onSuccess: (successResponse) => {
  //       const accessToken = successResponse.access_token;
  //       console.log(`successResponse:: ${JSON.stringify(successResponse)}`);
  //       console.log(`accessToken:: ${accessToken}`);
  //       //   setSignInState(true);
  //     },
  //     onError: (errorResponse) => {
  //       console.log(`Failed\nerrorResponse::${JSON.stringify(errorResponse)}`);
  //     },
  //   });
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
          {/* <Button onClick={() => login()}>Continue With Google</Button> */}
          <GoogleButton />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default GoogleSignInButton;
