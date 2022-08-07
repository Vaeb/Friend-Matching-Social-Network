import { Loader, MantineColor, MantineNumberSize, MantineTheme } from '@mantine/core';
import React, { FC } from 'react';

interface FullLoaderProps {
    variant?: MantineTheme['loader'];
    size?: MantineNumberSize;
    color?: MantineColor;
    grow?: boolean;
}

const FullLoader: FC<FullLoaderProps> = ({ variant, size, color, grow }) => {
    if (!variant) variant = 'oval';
    if (!size) size = 'xl';

    return (
        <div className={`flex items-center justify-center w-full ${grow ? 'grow' : 'h-full'}`}>
            <Loader variant={variant} size={size} color={color} />
        </div>
    );
};

export default FullLoader;