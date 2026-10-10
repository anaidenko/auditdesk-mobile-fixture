import { setupIonicReact } from "@ionic/react";
import { createRoot } from "react-dom/client";

import App from "./App";

setupIonicReact();
createRoot(document.getElementById("root")!).render(<App />);
