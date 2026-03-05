import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="17036355569-kqo9lo3vmjli90a59qdk7p0v3g4qovjr.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </StrictMode>
);