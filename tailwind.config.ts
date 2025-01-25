import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        text: {
          DEFAULT: "#1a1a1a",
          light: "#4a4a4a",
          dark: "#0a0a0a",
        },
        primary: "#2563eb",
        secondary: "#6b7280",
      },
    },
  },
  plugins: [],
};

export default config;
