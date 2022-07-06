import {
    Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Button, Select, Text, 
} from '@chakra-ui/react';
import React, { FC, useContext, useState } from 'react';
import { MeQuery } from '../generated/graphql';

interface SettingsMidProps {
    SettingGroupContext: React.Context<{
        settingGroup: string;
        setSettingGroup: (group: string) => void;
    }>;
    data?: MeQuery;
}

const OptionsAccount: FC<any> = ({ username }) => {
    return (
        <Box display="flex" flexDirection="column" w="100%">
            <Text fontSize="med" fontWeight="bold" color="#96989d" mb="18px">
                Username: {username}
            </Text>
        </Box>
    );
};

const OptionsMatching: FC = () => {
    const allInterests = ['Football', 'Basketball', 'Fishing'].map((name, i) => ({ name, id: i }));
    const [interests, setInterests] = useState<any>([]);

    console.log(allInterests, interests);

    const filteredInterests = allInterests.filter(({ id }) => !interests.includes(id));

    let selectedInterest = filteredInterests?.[0]?.id ?? -1;
    const handleChange = (e: any) => {
        selectedInterest = Number(e.target.value);
    };

    return (
        <Box display="flex" flexDirection="column" w="100%">
            <Text fontSize="med" fontWeight="bold" color="#96989d" mb="12px">
                What are your interests?
            </Text>
            <Box display="flex" alignItems="center" mb="12px">
                <Text fontSize="med" fontWeight="bold" color="#fff" display="inline">
                    Add new:
                </Text>
                <Select display="inline-block" ml="20px" mt="4px" width="300px" onChange={handleChange}>
                    {filteredInterests.map(({ name, id }) => (
                        <option key={`${id}`} value={`${id}`} style={{ color: 'black' }}>
                            {name}
                        </option>
                    ))}
                </Select>
                <Button p="0" m="0 0 0 2px" bg="none" _hover={{}} onClick={() => selectedInterest > -1 ? setInterests([...interests, selectedInterest]) : null}>
                    ✔️
                </Button>
            </Box>
            <Text fontSize="med" fontWeight="bold" color="#96989d" mb="18px">
                Added:
            </Text>
            <Accordion allowToggle>
                <AccordionItem>
                    <h2>
                        <AccordionButton>
                            <Box flex="1" textAlign="left">
                                Interests
                            </Box>
                            <AccordionIcon />
                        </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                        {interests.map(id => allInterests[id].name).join(', ')}
                    </AccordionPanel>
                </AccordionItem>
            </Accordion>
        </Box>
    );
};

const settingsDisplays = {
    account: OptionsAccount,
    matching: OptionsMatching,
} as { [key: string]: FC };

const SettingsMid: FC<SettingsMidProps> = ({ SettingGroupContext, data }) => {
    const { settingGroup } = useContext(SettingGroupContext);
    const safeTitle = settingGroup.replace(/\b(\w)/g, (m, p1) => p1.toUpperCase());
    // const options = settingsDisplays[settingGroup] as FC;

    return (
        <Box>
            <Text fontSize="3xl" fontWeight="semibold" color="#fff" mb="20px">
                {safeTitle}
            </Text>
            {settingGroup === 'account' ? <OptionsAccount username={data?.me?.username} /> : <OptionsMatching />}
        </Box>
    );
};

export default SettingsMid;
