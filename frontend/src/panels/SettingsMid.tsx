// import {
//     Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Button, Input, Select, Text, 
// } from '@chakra-ui/react';
import { Box, Stack, Text, Title, useMantineTheme } from '@mantine/core';
import React, { FC, useState } from 'react';
import Account from '../components/settings/Account';
import Matching from '../components/settings/Matching';

import { MeQuery } from '../generated/graphql';
import { useSettingsStore } from '../state';

interface SettingsMidProps {
    data?: MeQuery;
}

const SettingsMid: FC<SettingsMidProps> = ({ data }) => {
    const section = useSettingsStore(state => state.section);
    // const safeTitle = section.replace(/\b(\w)/g, (m, p1) => p1.toUpperCase());
    // const options = settingsDisplays[settingGroup] as FC;

    return (
        <Box>
            <Title sx={{ letterSpacing:'wide', textTransform:'capitalize', color: '#fff' }} order={1} color='#fff' mb='20px'>
                {section}
            </Title>
            {{
                account: <Account username={data?.me?.username} />,
                matching: <Matching />,
            }[section]}
        </Box>
    );
};

export default SettingsMid;
