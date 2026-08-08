import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        base: "#F4F0EE",
        jade: {
          DEFAULT: "#5C7C7A",
          dark: "#425B59",
          light: "#7FA09D",
        },
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "serif"],
        sans: ["var(--font-noto-sans-jp)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
