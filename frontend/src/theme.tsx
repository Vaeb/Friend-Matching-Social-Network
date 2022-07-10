import { extendTheme } from '@chakra-ui/react';
import { createBreakpoints, StyleFunctionProps } from '@chakra-ui/theme-tools';

const fonts = { mono: "'Menlo', monospace" };

const breakpoints = createBreakpoints({
    sm: '40em',
    md: '52em',
    lg: '64em',
    xl: '80em',
});

const theme = extendTheme({
    semanticTokens: {
        colors: {
            text: {
                default: '#16161D',
                _dark: '#ade3b8',
            },
            heroGradientStart: {
                default: '#7928CA',
                _dark: '#e3a7f9',
            },
            heroGradientEnd: {
                default: '#FF0080',
                _dark: '#fbec8f',
            },
        },
        radii: {
            button: '12px',
        },
    },
    colors: { // Strength
        black3: '#3c404b', // PanelM
        black6: '#2f3136', // Body, PanelR
        black8: '#202225', // PanelL, Borders (32, 34, 37)
        blackT5: 'rgba(79, 84, 92, 0.4)', // Setting Hover Background
        blackT6: 'rgba(79, 84, 92, 0.6)', // Icon Hover Background, Setting Background
        gray4: '#96989d', // Body
        gray6: '#b9bbbe', // Icon Text, Setting Text
        gray8: '#dcddde', // Setting Text Hover
        dividerT: 'rgba(79, 84, 92, 0.48)',
    },
    fonts,
    breakpoints,
    styles: {
        global: (props: StyleFunctionProps) => ({
            'html, body, #__next, #root, .App': {
                w: '100%',
                h: '100%',
                bg: 'black6',
                borderColor: 'black8',
            },
            body: {
                color: 'gray4',
            },
        }),
    },
});

export default theme;
