// import {
//     Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Button, Input, Select, Text, 
// } from '@chakra-ui/react';
import { Box, Text } from '@mantine/core';
import React, { FC } from 'react';
import Account from '../settings/Account';
import Matching from '../settings/Matching';

import { MeQuery } from '../../generated/graphql';
import { useSettingsStore } from '../../state';

interface SettingsMidProps {
    data?: MeQuery;
}

const SettingsMid: FC<SettingsMidProps> = ({ data }) => {
    const section = useSettingsStore(state => state.section);

    return (
        <Box>
            <Text className='tracking-wide capitalize text-3xl text-white font-medium' mb={10}>
                {section}
            </Text>
            {{
                account: <Account username={data?.me?.username} />,
                matching: <Matching />,
            }[section]}
        </Box>
    );
};

export default SettingsMid;
