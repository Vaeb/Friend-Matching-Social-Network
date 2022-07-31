import { Box, ScrollArea, Text, Title, useMantineTheme } from '@mantine/core';
import React, { FC } from 'react';
import Account, { desc as accountDesc } from '../settings/Account';
import Matching, { desc as matchingDesc } from '../settings/Matching';

import { MeQuery } from '../../generated/graphql';
import { useAppStore } from '../../state';

const descriptions: Record<string, string> = {
    account: accountDesc,
    matching: matchingDesc,
};

interface SettingsMidProps {
    data?: MeQuery;
}

const SettingsMid: FC<SettingsMidProps> = ({ data }) => {
    const theme = useMantineTheme();
    const section = useAppStore(state => state.left.viewValue);
    const desc = descriptions[section];

    return data?.me ? (
        <ScrollArea className='h-full'>
            <Title className='tracking-wide capitalize text-3xl text-white font-medium' mb={10}>
                {section}
            </Title>
            {desc ? <Text size='md' weight='bold' color={theme.colors._gray[4]} mb={34}>
                {desc}
            </Text> : null}
            {{
                account: <Account username={data.me.username} />,
                matching: <Matching userId={data.me.id} />,
            }[section]}
        </ScrollArea>
    ) : null;
};

export default SettingsMid;
