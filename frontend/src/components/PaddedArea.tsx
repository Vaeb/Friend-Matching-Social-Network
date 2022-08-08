import React from 'react';
import { Box } from '@mantine/core';

import { useMobileDetect } from '../utils/useMobileDetect';

type PaddedAreaProps = {
    children: React.ReactNode;
    className?: string;
    full?: boolean;
    x?: boolean | number;
    xScr?: boolean;
    y?: boolean | number;
    needsP?: boolean;
};

const PaddedArea = ({
    children, className, full, x, y, xScr, needsP, 
}: PaddedAreaProps) => {
    const device = useMobileDetect();

    const isMobile = device.isMobile();

    const sx: any = {};
    if (typeof x === 'number') {
        sx.paddingLeft = x;
        sx.paddingRight = x;
        x = false;
    }
    if (typeof y === 'number') {
        sx.paddingTop = x;
        sx.paddingBottom = x;
        y = false;
    }
    const useSx = Object.keys(sx).length > 0;
    return (
        <Box
            className={`${full ? 'h-full' : ''} ${isMobile && xScr ? (needsP ? 'px-[10px]' : 'px-[0px]') : (xScr ? 'px-[27px]' : x ? 'px-[32px]' : '')} ${y ? 'py-[20px]' : ''}
                ${className}`}
            sx={useSx ? sx : undefined}
        >
            {children}
        </Box>
    );
};

export default PaddedArea;
