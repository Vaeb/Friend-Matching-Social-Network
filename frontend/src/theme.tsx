import { MantineThemeOverride } from '@mantine/core';

const myTheme: MantineThemeOverride = {
    colorScheme: 'dark',
    fontFamily: "'Inter', sans-serif",
    headings: {
        fontFamily: "'Poppins', sans-serif",
    },
    // fontFamily: "'Inter', sans-serif",
    // Strength
    colors: {
        // 3: PanelM
        // 6: Body, PanelR, PanelL
        // 8: PanelL, Borders (32, 34, 37)
        _black: [undefined, undefined, undefined, '#3c404b', undefined, undefined, '#2f3136', undefined, '#202225', undefined],
        // 5: Setting Hover Background
        // 6: Icon Hover Background, Setting Background
        _blackT: [undefined, undefined, undefined, undefined, undefined, 'rgba(79, 84, 92, 0.4)', 'rgba(79, 84, 92, 0.6)', undefined, undefined, undefined],
        // #ffffff: Setting Option Name Text
        // 4: Body
        // 6: Icon Text, Setting Subsection Title Text, Setting Description Text
        // 8: Setting Text Hover, Regular Text (Messages)
        _gray: [undefined, undefined, undefined, undefined, '#96989d', undefined, '#b9bbbe', undefined, '#dcddde', undefined],
        _dividerT: ['rgba(79, 84, 92, 0.48)'],
        _dividerT2: ['rgba(79, 84, 92, 0.9)'],
        _label: ['#c1c2c5'],
        _scrollThumb: ['hsl(216, 7.2%, 13.5%)', 'hsl(216, 7.2%, 13.5%)', 'hsl(216, 7.2%, 13.5%)'],
        _scrollTrack: ['hsl(210, 9.8%, 20%)', 'hsl(223, 6.9%, 19.8%)', 'hsla(0,0%,0%,0)'],
    },
};

export default myTheme;
