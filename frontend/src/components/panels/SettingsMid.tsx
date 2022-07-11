import { Box, Text, useMantineTheme } from '@mantine/core';
import React, { FC } from 'react';
import Account from '../settings/Account';
import Matching from '../settings/Matching';

import { MeQuery } from '../../generated/graphql';
import { useSettingsStore } from '../../state';

const descriptions: Record<string, string> = {
    matching: 'What are your interests?',
};

interface SettingsMidProps {
    data?: MeQuery;
}

const SettingsMid: FC<SettingsMidProps> = ({ data }) => {
    const theme = useMantineTheme();
    const section = useSettingsStore(state => state.section);
    const desc = descriptions[section];

    return (
        <Box>
            <Text className='tracking-wide capitalize text-3xl text-white font-medium' mb={10}>
                {section}
            </Text>
            {desc ? <Text size='md' weight='bold' color={theme.colors._gray[4]} mb={34}>
                {desc}
            </Text> : null}
            {{
                account: <Account username={data?.me?.username} />,
                matching: <Matching />,
            }[section]}
        </Box>
    );
};

export default SettingsMid;
