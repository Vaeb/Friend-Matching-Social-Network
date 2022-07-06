import { Box, Button, Text } from '@chakra-ui/react';
import React, { FC, useContext } from 'react';

interface SettingsLeftProps {
    SettingGroupContext: React.Context<{
        settingGroup: string;
        setSettingGroup: (group: string) => void;
    }>;
}

const SettingsLeft: FC<SettingsLeftProps> = ({ SettingGroupContext }) => {
    const { settingGroup, setSettingGroup } = useContext(SettingGroupContext);

    const SettingGroupButton: FC<any> = ({ children, name }) => {
        const selected = name === settingGroup;
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
            onClick={() => setSettingGroup(name)}
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
