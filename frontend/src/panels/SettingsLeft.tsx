import { Box, Button, Flex, Text, VStack } from '@chakra-ui/react';
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
            bg={selected ? 'blackT6' : 'none'}
            fontSize='large'
            fontWeight='500'
            color={selected ? '#fff' : 'gray6'}
            pl='16px'
            mb='10px'
            w='100%'
            textAlign='left'
            justifyContent='left'
            _hover={!selected ? { bg: 'blackT5', color: 'gray8' } : {}}
            onClick={() => setSection(name)}
        >
            {children}
        </Button>);
    };

    return (
        <VStack w='100%'>
            <Text fontSize='med' fontWeight='bold' color='gray4' pl='16px' mb='18px'>
                SETTINGS
            </Text>
            <SettingGroupButton name='account'>Account</SettingGroupButton>
            <SettingGroupButton name='matching'>Matching</SettingGroupButton>
        </VStack>
    );
};

export default SettingsLeft;
