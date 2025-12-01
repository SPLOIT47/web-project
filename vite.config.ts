import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src"),
            "@components": path.resolve(__dirname, "src/components"),
            "@pages": path.resolve(__dirname, "src/pages"),
            "@context": path.resolve(__dirname, "src/context"),
            "@i18n": path.resolve(__dirname, "src/i18n"),
            "@styles": path.resolve(__dirname, "src/styles"),
            "@layouts": path.resolve(__dirname, "src/layouts"),
        }
    },
    base: "/web-project/",
});