import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { worker } from "./mocks/browser";

// createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//     <BrowserRouter>

//       <App />

//     </BrowserRouter>
//   </React.StrictMode>
// );

if(import.meta.env.MODE === 'development') {
  worker.start().then(() => {
    createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <BrowserRouter>

        <App />

      </BrowserRouter>
    </React.StrictMode>
 
)
  })
}else{
  createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <BrowserRouter>

        <App />

      </BrowserRouter>
    </React.StrictMode>
 
)
}