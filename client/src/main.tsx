import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

import { Router } from "wouter";

createRoot(document.getElementById("root")!).render(
  <Router base="/linkfy">
    <App />
  </Router>
);
