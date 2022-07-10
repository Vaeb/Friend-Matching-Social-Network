import { MantineThemeOverride } from '@mantine/core';

const myTheme: MantineThemeOverride = {
    colorScheme: 'dark',
    // fontFamily: "'Inter', sans-serif",
    // Strength
    colors: {
        // 3: PanelM
        // 6: Body, PanelR
        // 8: PanelL, Borders (32, 34, 37)
        _black: [undefined, undefined, undefined, '#3c404b', undefined, undefined, '#2f3136', undefined, '#202225', undefined],
        // 5: Setting Hover Background
        // 6: Icon Hover Background, Setting Background
        _blackT: [undefined, undefined, undefined, undefined, undefined, 'rgba(79, 84, 92, 0.4)', 'rgba(79, 84, 92, 0.6)', undefined, undefined, undefined],
        // 4: Body
        // 6: Icon Text, Setting Text
        // 8: Setting Text Hover
        _gray: [undefined, undefined, undefined, undefined, '#96989d', undefined, '#b9bbbe', undefined, '#dcddde', undefined],
        _dividerT: ['rgba(79, 84, 92, 0.48)'],
    },
};

export default myTheme;
