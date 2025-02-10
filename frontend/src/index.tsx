import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { ClerkLoaded, ClerkProvider } from "@clerk/clerk-react";

import App from "./App.tsx";

// Entrypoint for React

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const root = createRoot(document.getElementById("root")!);

root.render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <ClerkLoaded>
        <App />
      </ClerkLoaded>
    </ClerkProvider>
  </StrictMode>
);
