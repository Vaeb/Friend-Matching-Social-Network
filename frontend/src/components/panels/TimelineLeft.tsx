import {
    Button, Stack, 
} from '@mantine/core';
import React, { FC } from 'react';
import { useTimelineStore } from '../../state';

// import { GetMatchesQuery } from '../../generated/graphql';
// import { useAppStore } from '../../state';

const TimelineLeft: FC = () => {
    // const theme = useMantineTheme();
    const scrollToTop = useTimelineStore(state => state.scrollToTop);

    return (
        <Stack mt={25} className='w-full items-center'>
            <Button variant='outline' className='w-[80%]' onClick={scrollToTop}>Scroll to top</Button>
        </Stack>
    );
};

export default TimelineLeft;
