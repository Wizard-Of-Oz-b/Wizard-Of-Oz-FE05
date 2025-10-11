import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { worker } from "./mocks/browser";
import { AuthProvider } from "./context/AuthContext";


// createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//     <BrowserRouter>

//       <App />

//     </BrowserRouter>
//   </React.StrictMode>
// );

const container = document.getElementById("root");
const root = createRoot(container);

if (import.meta.env.MODE === "development") {
  worker
    .start({
      onUnhandledRequest: "bypass",
      serviceWorker: {
        url: "/mockServiceWorker.js",
      },
    })
    .then(() => {
      root.render(
        <React.StrictMode>
          <AuthProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
          </AuthProvider>
        </React.StrictMode>
      );
    });
} else {
  root.render(
          <AuthProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
          </AuthProvider>
  );
}