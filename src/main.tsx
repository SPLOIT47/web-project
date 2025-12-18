import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "@styles/globals.css";
import "@i18n";
import "@/icons/fontawesome";
import {seedMockDatabase} from "@/infrastructure/mock/seed";
import {ServiceLocator} from "@/application/ServiceLocator";
import {resetDb} from "@/infrastructure/mock/database";

ServiceLocator.useMockBackend()
resetDb();
seedMockDatabase();

ReactDOM.createRoot(document.getElementById("root")!).render(
        <App />
);