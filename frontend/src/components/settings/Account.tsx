import { Stack, Text, useMantineTheme } from '@mantine/core';
import React, { FC } from 'react';

const Account: FC<any> = ({ username }) => {
    const theme = useMantineTheme();
    return (
        <Stack>
            <Text size='md' weight='bold' color={theme.colors._gray[4]} mb={18}>
                Username: {username}
            </Text>
        </Stack>
    );
};

export default Account;
