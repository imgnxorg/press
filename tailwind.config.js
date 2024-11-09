import typography from "@tailwindcss/typography";
import forms from "@tailwindcss/forms";
import aspectRatio from "@tailwindcss/aspect-ratio";
import containerQueries from "@tailwindcss/container-queries";

/** @type {import('tailwindcss').Config} */
export default {
    content: ["./src/**/*.{html,vue,js,ts,jsx,tsx,css}"],
    theme: {
        extend: {},
    },
    plugins: [typography, forms, aspectRatio, containerQueries],
};
