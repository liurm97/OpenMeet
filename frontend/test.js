const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const REDIRECT_URI = "auth/api/login/google/";

const scope = [
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
].join(" ");

const params = {
  response_type: "code",
  client_id:
    "164409861730-mgmggop0iadn56sd9283uokp7hol4h8c.apps.googleusercontent.com",
  redirect_uri: `http://localhost:8000/${REDIRECT_URI}`,
  prompt: "select_account",
  access_type: "offline",
  scope,
};

const urlParams = new URLSearchParams(params).toString();
const locationURL = `https://accounts.google.com/o/oauth2/v2/auth?${urlParams}`;
console.log(locationURL);
