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
    className = className ?? '';
    const device = useMobileDetect();
    const origX = x;

    const isMobile = device.isMobile();

    const sx: any = {};
    if (typeof x === 'number') {
        sx.paddingLeft = `${x}px`;
        sx.paddingRight = `${x}px`;
        x = false;
    }
    if (typeof y === 'number') {
        sx.paddingTop = `${y}px`;
        sx.paddingBottom = `${y}px`;
        y = false;
    }
    const useSx = Object.keys(sx).length > 0;
    console.log(useSx, origX, x, sx, xScr, needsP);
    return (
        <Box
            className={`${full ? 'h-full' : ''} ${isMobile && xScr ? (needsP ? 'px-[10px]' : 'px-[0px]') : (xScr ? 'px-[27px]' : x ? 'px-[32px]' : '')} ${y ? 'py-[20px]' : ''}
                ${className}`}
            style={useSx ? sx : undefined}
        >
            {children}
        </Box>
    );
};

export default PaddedArea;
