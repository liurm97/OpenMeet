// import { getAuth } from '@clerk/react-router/ssr.server'
import AuthenticatedMainBody from "@/layout/(authenticated)/AuthenticatedMainBody";
import AuthenticatedMainHeader from "@/layout/(authenticated)/AuthenticatedMainHeader";
import { useAuth, useUser } from "@clerk/react-router";

const AuthenticatedHomePage = () => {
  const user = useAuth();
  console.log(`user:: ${user}`);
  return (
    <>
      <AuthenticatedMainHeader />
      <AuthenticatedMainBody />
    </>
  );
};

export default AuthenticatedHomePage;
