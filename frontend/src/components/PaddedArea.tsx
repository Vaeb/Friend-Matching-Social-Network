import React from 'react';
import { Box } from '@mantine/core';

type PaddedAreaProps = {
    children: React.ReactNode;
    className?: string;
    full?: boolean;
    x?: boolean | number;
    xScr?: boolean;
    y?: boolean | number;
};

const PaddedArea = ({ children, className, full, x, y, xScr }: PaddedAreaProps) => {
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
        <Box className={`${full ? 'h-full' : ''} ${x ? 'px-[32px]' : ''} ${xScr ? 'px-[27px]' : ''} ${y ? 'py-[20px]' : ''} ${className}`} sx={useSx ? sx : undefined}>
            {children}
        </Box>
    );
};

export default PaddedArea;
