/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
    content: ['./src/pages/**/*.{js,ts,jsx,tsx}', './src/components/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                _black: {
                    300: '#3c404b',
                    600: '#2f3136',
                    800: '#202225',
                },
                _blackT: {
                    500: 'rgba(79, 84, 92, 0.4)',
                    600: 'rgba(79, 84, 92, 0.6)',
                },
                _gray: {
                    400: '#96989d',
                    600: '#b9bbbe',
                    800: '#dcddde',
                },
                _dividerT: 'rgba(79, 84, 92, 0.48)',
                _sky: {
                    500: '#00aff4',
                },
            },
            boxShadow: {
                _box5: `
                    0 2.3px 3.6px #4f4f4f,
                    0 .3px 10px rgba(0, 0, 0, 0.046),
                    0 15.1px 24.1px rgba(0, 0, 0, 0.051),
                    0 30px 40px rgba(0, 0, 0, 0.5)
                `,
            },
            fontFamily: {
                sans: ["'Inter'", ...defaultTheme.fontFamily.sans],
                inter: ["'Inter'", ...defaultTheme.fontFamily.sans],
                poppins: ["'Poppins'", ...defaultTheme.fontFamily.sans],
            },
        },
    },
    plugins: [],
    important: '#__next',
};
