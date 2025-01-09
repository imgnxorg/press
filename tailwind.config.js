import typography from "@tailwindcss/typography";
import forms from "@tailwindcss/forms";
import aspectRatio from "@tailwindcss/aspect-ratio";
import containerQueries from "@tailwindcss/container-queries";

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/**.{js,jsx,ts,tsx}", // Adjust paths as needed
        "./public/index.html",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                crimson: {
                    50: "#fdf3f3",
                    100: "#fce4e4",
                    200: "#facece",
                    300: "#f5acac",
                    400: "#ed7c7c",
                    500: "#df4242",
                    600: "#ce3434",
                    700: "#ad2828",
                    800: "#8f2525",
                    900: "#772525",
                    950: "#400f0f",
                },
                candlelight: {
                    50: "#fefce8",
                    100: "#fffbc2",
                    200: "#fff289",
                    300: "#ffe135",
                    400: "#fdd112",
                    500: "#ecb606",
                    600: "#cc8d02",
                    700: "#a36405",
                    800: "#864e0d",
                    900: "#724011",
                    950: "#432105",
                },
                blue: {
                    50: "#e8f7ff",
                    100: "#d5efff",
                    200: "#b3dfff",
                    300: "#85c7ff",
                    400: "#56a1ff",
                    500: "#2f7aff",
                    600: "#0c4cff",
                    700: "#0041ff",
                    800: "#063ccd",
                    900: "#103a9f",
                    950: "#0a205c",
                },
                wisteria: {
                    50: "#f9f7fb",
                    100: "#f2f0f7",
                    200: "#e8e3f1",
                    300: "#d6cde5",
                    400: "#c0afd6",
                    500: "#a88fc3",
                    600: "#9575b2",
                    700: "#8c6ca5",
                    800: "#6f5285",
                    900: "#5c446e",
                    950: "#3b2c49",
                },
            },
        },
    },
    plugins: [typography, forms, aspectRatio, containerQueries],
};
