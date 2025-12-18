module.exports = {
    darkMode: "class",
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./src/styles/**/*.{css}"
    ],
    theme: {
        extend: {
            screens: {
                'tablet': '480px',
                'laptop': '720px',
                'desktop': '1440px',
                'wide': '1960px',
            },
            colors: {
                primary: {
                    light: "#3B82F6",
                    dark: "#FF2D95",
                },
                bg: {
                    light: "#F5F8FF",
                    dark: "#0D0D0F",
                },
                surface: {
                    light: "#FFFFFF",
                    dark: "#121216",
                },
            },
            boxShadow: {
                neonBlue: "0 0 10px rgba(59,130,246,0.4)",
                neonPink: "0 0 14px rgba(255,45,149,0.6)",
            },
        },
    },
    plugins: [],
};