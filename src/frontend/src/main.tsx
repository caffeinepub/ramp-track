import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ReactDOM from "react-dom/client";
import App from "./App";
import { InternetIdentityProvider } from "./hooks/useInternetIdentity";
import "./index.css";

BigInt.prototype.toJSON = function () {
  return this.toString();
};

declare global {
  interface BigInt {
    toJSON(): string;
  }
}

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <InternetIdentityProvider>
      <App />
    </InternetIdentityProvider>
  </QueryClientProvider>,
);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("[SW] Registered, scope:", registration.scope);

        // Log when the SW becomes active and controls the page
        if (registration.active) {
          console.log("[SW] Already active and controlling page");
        } else {
          const sw = registration.installing || registration.waiting;
          if (sw) {
            sw.addEventListener("statechange", () => {
              if (sw.state === "activated") {
                console.log("[SW] Activated and controlling page");
              }
            });
          }
        }

        // Confirm controller after activation
        navigator.serviceWorker.addEventListener("controllerchange", () => {
          console.log(
            "[SW] Controller changed — SW now controls page:",
            navigator.serviceWorker.controller,
          );
        });
      })
      .catch((err) => {
        console.error("[SW] Registration failed:", err);
      });
  });
}
