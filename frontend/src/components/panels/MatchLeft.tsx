import {
    Button, Stack, useMantineTheme, 
} from '@mantine/core';
import React, { FC } from 'react';

// import { GetMatchesQuery } from '../../generated/graphql';
// import { useAppStore } from '../../state';

const MatchLeft: FC = () => {
    const theme = useMantineTheme();
    // const match: GetMatchesQuery['getMatches'][0]['user'] = useAppStore(state => state.mid.viewValue);
    // const [{ data: meData, fetching: meFetching }] = useMeQuery();

    // {`flex w-full ${isMe(message.from) ? 'justify-end' : ''}`}
    return (
        <Stack mt={22} className='h-full items-center'>
            <Button variant='outline' className='w-[80%]'>Add Friend</Button>
        </Stack>
    );
};

export default MatchLeft;
