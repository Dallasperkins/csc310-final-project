import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const rootElement = document.getElementById("root");

if (rootElement) {
  createRoot(rootElement).render(
    <DndProvider backend={HTML5Backend}>
      <App />
    </DndProvider>
  );
} else {
  console.error("Root element not found! App cannot render.");
}
