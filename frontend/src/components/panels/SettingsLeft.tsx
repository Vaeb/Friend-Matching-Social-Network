import { Box, Button, Stack, Text, useMantineTheme } from '@mantine/core';
import React, { FC } from 'react';
import shallow from 'zustand/shallow';

import { useLogoutMutation } from '../../generated/graphql';
import { useAppStore } from '../../state';

const SettingsLeft = () => {
    const theme = useMantineTheme();
    const [, doLogout] = useLogoutMutation();

    const { section, setView } = useAppStore(state => ({ section: state.left.viewValue, setView: state.setView }), shallow);

    const logout = async () => {
        await doLogout();
    };

    const SettingGroupButton: FC<any> = ({ children, name }) => {
        const selected = name === section;
        return (
            <Button
                sx={{
                    backgroundColor: selected ? theme.colors._black[6] : 'transparent',
                    color: selected ? '#fff' : theme.colors._gray[6],
                    fontSize: '16px',
                    fontWeight: 500,
                    textAlign: 'left',
                    width: '100%',
                    '&:hover': !selected
                        ? {
                            backgroundColor: theme.colors._blackT[5],
                            color: theme.colors._gray[8],
                        }
                        : { backgroundColor: theme.colors._black[6] },
                }}
                styles={{
                    inner: {
                        justifyContent: 'flex-start',
                    },
                }}
                pl={20}
                onClick={() => setView(undefined, 'left', name)}
            >
                {children}
            </Button>
        );
    };

    return (
        <Box className='flex flex-col w-full'>
            <Text size={14} weight='700' color='dimmed' pl={20} mt={8} mb={28}>
                SETTINGS
            </Text>
            <div className='flex flex-col justify-between h-full'>
                <Stack align='flex-start' justify='flex-start' spacing={14}>
                    <SettingGroupButton name='account'>Account</SettingGroupButton>
                    <SettingGroupButton name='matching'>Matching</SettingGroupButton>
                </Stack>
                <Stack className='mb-2' align='flex-start' justify='flex-start' spacing={14}>
                    <Button
                        className='w-full pl-5 bg-transparent text-_gray-600 text-[16px] font-[500] hover:bg-_blackT-500 hover:text-_gray-800'
                        classNames={{ inner: 'justify-start' }}
                        onClick={() => logout()}
                    >
                        Logout
                    </Button>
                </Stack>
            </div>
        </Box>
    );
};

export default SettingsLeft;
