import "./lib/zodHr"; // Croatian validation messages (must load before any schema is used)
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
