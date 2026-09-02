/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Vision Driven brand palette (from Brand Style Guide v2)
        brand: {
          gold: "#D0AA44",
          goldsoft: "#E4C878",
          golddeep: "#A9832F",
          indigo: "#4B0082",
          indigolight: "#6A2FA8",
          plum: "#270626",
          plumdeep: "#1A0419",
          black: "#0B0710",
          white: "#FFFFFF",
        },
        // Semantic roles for the dark site
        bg: "#0B0710",
        surface: "#170C1C",
        surface2: "#211031",
        border: "#3A2450",
        text: "#F5F1EA",
        muted: "#B7A9C4",
        primary: "#D0AA44",
        secondary: "#6A2FA8",
        accent: "#E4C878",
        cta: "#D0AA44",
      },
      fontFamily: {
        heading: ['"Jost"', '"Futura"', '"Century Gothic"', "system-ui", "sans-serif"],
        body: ['"Jost"', '"Futura"', "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        script: ['"Tangerine"', '"Eyesome Script"', "cursive"],
      },
      maxWidth: {
        prose: "46rem",
      },
      typography: null,
    },
  },
  plugins: [],
};
