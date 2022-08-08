import React from 'react';
import { ScrollArea } from '@mantine/core';
import PaddedArea from './PaddedArea';

type CustomScrollProps = {
    children?: React.ReactNode;
    scrollPadded?: boolean;
    needsP?: boolean;
};

const CustomScroll = React.forwardRef(function CustomScroll({ children, scrollPadded, needsP }: CustomScrollProps, ref: any) {
    return (
        <ScrollArea
            className='grow px-0 pb-0'
            viewportRef={ref}
            offsetScrollbars
            type='always'
            classNames={{
                root: 'mx-[5px] h-full',
                scrollbar: 'rounded-full my-[4px] px-0 w-[8px] bg-_scrollTrack-50 hover:bg-_scrollTrack-50',
                thumb: 'bg-_scrollThumb-50',
            }}
        >
            {scrollPadded ? <PaddedArea xScr needsP={needsP}>{children}</PaddedArea> : children}
        </ScrollArea>
    );
});

export default CustomScroll;
