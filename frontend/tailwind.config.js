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
                _blue: {
                    700: 'rgb(25, 113, 194)',
                    800: 'rgb(28, 126, 214)',
                },
                _dividerT: 'rgba(79, 84, 92, 0.48)',
                _dividerT2: 'rgba(79, 84, 92, 0.9)',
                _label: '#c1c2c5',
                _scrollThumb: { 50: 'hsl(216, 7.2%, 13.5%)', 100: 'hsl(216, 7.2%, 13.5%)', 200: 'hsl(216, 7.2%, 13.5%)' },
                _scrollTrack: { 50: 'hsl(210, 9.8%, 20%)', 100: 'hsl(223, 6.9%, 19.8%)', 200: 'hsla(0,0%,0%,0)' },
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
                _box6: 'rgba(4, 4, 5, 0.2) 0px 1px 0px 0px, rgba(6, 6, 7, 0.05) 0px 1.5px 0px 0px, rgba(4, 4, 5, 0.05) 0px 2px 0px 0px',
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
