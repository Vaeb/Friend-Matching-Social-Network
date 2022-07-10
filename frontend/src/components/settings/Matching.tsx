import { useMantineTheme } from '@mantine/core';
import React, { FC, useState } from 'react';

const Matching: FC = () => {
    const theme = useMantineTheme();

    const allInterests = ['Football', 'Basketball', 'Fishing'].map((name, i) => ({ name, id: i }));
    const [interests, setInterests] = useState<any>([]);

    console.log(allInterests, interests);

    const filteredInterests = allInterests.filter(({ id }) => !interests.includes(id));

    let selectedInterest = filteredInterests?.[0]?.id ?? -1;
    const handleChange = (e: any) => {
        selectedInterest = Number(e.target.value);
    };

    return (
        <Box display='flex' flexDirection='column' w='100%'>
            <Text fontSize='med' fontWeight='bold' color='gray4' mb='12px'>
                What are your interests?
            </Text>
            <Box display='flex' alignItems='center' mb='12px'>
                <Text fontSize='med' fontWeight='bold' color='#fff' display='inline'>
                    Add new:
                </Text>
                <Select display='inline-block' ml='20px' mt='4px' width='300px' onChange={handleChange}>
                    {filteredInterests.map(({ name, id }) => (
                        <option key={`${id}`} value={`${id}`} style={{ color: 'black' }}>
                            {name}
                        </option>
                    ))}
                </Select>
                <Button p='0' m='0 0 0 2px' bg='none' _hover={{}} onClick={() => selectedInterest > -1 ? setInterests([...interests, selectedInterest]) : null}>
                    ✔️
                </Button>
            </Box>
            <Text fontSize='med' fontWeight='bold' color='gray4' mb='18px'>
                Added:
            </Text>
            <Accordion allowToggle>
                <AccordionItem>
                    <h2>
                        <AccordionButton>
                            <Box flex='1' textAlign='left'>
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
            <Text mt='12px' fontSize='med' fontWeight='bold' color='#fff' display='inline'>
                Match precision:
            </Text>
            <Input />
        </Box>
    );
};

export default Matching;
