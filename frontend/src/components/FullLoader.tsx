import { Loader, MantineColor, MantineNumberSize, MantineTheme } from '@mantine/core';
import React, { FC } from 'react';

interface FullLoaderProps {
    variant?: MantineTheme['loader'];
    size?: MantineNumberSize;
    color?: MantineColor;
}

const FullLoader: FC<FullLoaderProps> = ({ variant, size, color }) => {
    if (!variant) variant = 'oval';
    if (!size) size = 'xl';

    return (
        <div className='flex items-center justify-center w-full h-full'>
            <Loader variant={variant} size={size} color={color} />
        </div>
    );
};

export default FullLoader;