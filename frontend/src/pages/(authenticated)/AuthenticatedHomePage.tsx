// import { getAuth } from '@clerk/react-router/ssr.server'
import AuthenticatedMainBody from "@/layout/(authenticated)/AuthenticatedMainBody";
import AuthenticatedMainHeader from "@/layout/(authenticated)/AuthenticatedMainHeader";
const AuthenticatedHomePage = () => {
  return (
    <>
      <AuthenticatedMainHeader />
      <AuthenticatedMainBody />
    </>
  );
};

export default AuthenticatedHomePage;
