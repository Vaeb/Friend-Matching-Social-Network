import { Box, Button, Text } from '@chakra-ui/react';
import React, { FC } from 'react';
import shallow from 'zustand/shallow';

import { useSettingsStore } from '../state';

interface SettingsLeftProps {
}

const SettingsLeft: FC<SettingsLeftProps> = () => {
    const { section, setSection } = useSettingsStore(state => ({ section: state.section, setSection: state.setSection }), shallow);

    const SettingGroupButton: FC<any> = ({ children, name }) => {
        const selected = name === section;
        return (<Button
            bg={selected ? 'rgba(79, 84, 92, 0.6)' : 'none'}
            fontSize="large"
            fontWeight="500"
            color={selected ? '#fff' : 'b9bbbe'}
            pl="16px"
            mb="10px"
            w="100%"
            textAlign="left"
            justifyContent="left"
            _hover={!selected ? { bg: 'rgba(79, 84, 92, 0.4)', color: '#dcddde' } : {}}
            onClick={() => setSection(name)}
        >
            {children}
        </Button>);
    };

    return (
        <Box display="flex" flexDirection="column" w="100%">
            <Text fontSize="med" fontWeight="bold" color="#96989d" pl="16px" mb="18px">
                SETTINGS
            </Text>
            <SettingGroupButton name="account">Account</SettingGroupButton>
            <SettingGroupButton name="matching">Matching</SettingGroupButton>
        </Box>
    );
};

export default SettingsLeft;
