import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "@styles/globals.css";
import "@i18n";
import "@/icons/fontawesome";
import {initFakeDatabase} from "@/infrastructure/mock/faker";

initFakeDatabase();

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);