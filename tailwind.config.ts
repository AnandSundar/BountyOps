import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                primary: {
                    DEFAULT: "#10B981",
                    foreground: "#ffffff",
                },
                secondary: {
                    DEFAULT: "#06B6D4",
                    foreground: "#ffffff",
                },
                muted: {
                    DEFAULT: "#1e293b",
                    foreground: "#94a3b8",
                },
                accent: {
                    DEFAULT: "#10B981",
                    foreground: "#ffffff",
                },
                card: {
                    DEFAULT: "rgba(15, 23, 42, 0.8)",
                    foreground: "#f8fafc",
                },
                border: "var(--border)",
                input: "var(--input)",
                ring: "var(--ring)",
                destructive: {
                    DEFAULT: "#ef4444",
                    foreground: "#ffffff",
                },
                navy: {
                    900: "#0F172A",
                    800: "#1E293B",
                    700: "#334155",
                    600: "#475569",
                },
                neon: {
                    green: "#10B981",
                    teal: "#06B6D4",
                },
            },
            fontFamily: {
                sans: ["var(--font-geist-sans)", "Inter", "sans-serif"],
                mono: ["var(--font-geist-mono)", "monospace"],
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "glass-gradient":
                    "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)",
            },
            backdropBlur: {
                glass: "12px",
            },
            boxShadow: {
                glow: "0 0 20px rgba(16, 185, 129, 0.3)",
                "glow-lg": "0 0 40px rgba(16, 185, 129, 0.4)",
            },
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
                "fade-in": {
                    from: { opacity: "0", transform: "translateY(10px)" },
                    to: { opacity: "1", transform: "translateY(0)" },
                },
                "slide-in-right": {
                    from: { transform: "translateX(100%)" },
                    to: { transform: "translateX(0)" },
                },
                pulse: {
                    "0%, 100%": { opacity: "1" },
                    "50%": { opacity: "0.5" },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
                "fade-in": "fade-in 0.5s ease-out",
                "slide-in-right": "slide-in-right 0.3s ease-out",
                pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
            },
        },
    },
    plugins: [],
};

export default config;
