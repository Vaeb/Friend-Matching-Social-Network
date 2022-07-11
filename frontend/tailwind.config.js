/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/pages/**/*.{js,ts,jsx,tsx}', './src/components/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                '_blackT': 'rgb(79, 84, 92)',
                '_black1': '#202225',
            }
        },
    },
    plugins: [],
    important: '#__next',
};
