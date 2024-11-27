/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class', // Abilita il tema scuro
    content: [
        "./src/**/*.{js,jsx,ts,tsx}", // Assicura che Tailwind scansioni tutti i file
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'], // Font moderno
            },
            colors: {
                background: '#000',
                foreground: '#fff',
                primary: '#1e90ff',
                secondary: '#00bfff',
            },
        },
    },
    plugins: [],
};
