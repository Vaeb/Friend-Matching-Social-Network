// import { Box, Button, Flex, Text, VStack } from '@chakra-ui/react';
import { Box, Button, Stack, Text, useMantineTheme } from '@mantine/core';
import React, { FC } from 'react';
import shallow from 'zustand/shallow';

import { useSettingsStore } from '../../state';

const SettingsLeft = () => {
    const theme = useMantineTheme();
    const { section, setSection } = useSettingsStore(state => ({ section: state.section, setSection: state.setSection }), shallow);

    const SettingGroupButton: FC<any> = ({ children, name }) => {
        const selected = name === section;
        return (<Button
            sx={{
                backgroundColor: selected ? theme.colors._black[6] : 'transparent',
                color: selected ? '#fff' : theme.colors._gray[6],
                fontSize: '16px',
                fontWeight: 500,
                textAlign: 'left',
                width: '100%',
                '&:hover': !selected ? {
                    backgroundColor: theme.colors._blackT[5],
                    color: theme.colors._gray[8],
                } : { backgroundColor: theme.colors._black[6] },
            }}
            styles={{
                inner: {
                    justifyContent: 'flex-start',
                },
            }}
            pl={20}
            onClick={() => setSection(name)}
        >
            {children}
        </Button>);
    };

    return (
        <Box>
            <Text size={14} weight='700' color='dimmed' pl={20} mt={8} mb={28}>
                SETTINGS
            </Text>
            <Stack align='flex-start' justify='flex-start' spacing={14}>
                <SettingGroupButton name='account'>Account</SettingGroupButton>
                <SettingGroupButton name='matching'>Matching</SettingGroupButton>
            </Stack>
        </Box>
    );
};

export default SettingsLeft;
