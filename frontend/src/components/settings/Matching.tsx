import {
    Accordion,
    Autocomplete,
    AutocompleteItem,
    Box,
    Button,
    Group,
    NumberInput,
    Slider,
    Stack,
    Table,
    Text,
    useMantineTheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import React, { useState } from 'react';
import { motion } from 'framer-motion';

type InterestData = {
    name: string;
    score: number;
};

const Matching = () => {
    const theme = useMantineTheme();

    const allInterests = [
        'Football',
        'Skating',
        'Basketball',
        'Hackathons',
        'Computer Science',
        'Fishing',
        'Frisbee',
        'Photography',
        'Running',
        'Skiing',
        'Soccer',
        'Swimming',
        'Tennis',
        'Volleyball',
    ];
    const gotInterests: InterestData[] = [
        { name: 'Computer Science', score: 90 },
        { name: 'Hackathons', score: 40 },
        { name: 'Frisbee', score: -30 },
    ];
    const sliderMarks = [
        { value: -100, label: 'Hate' },
        { value: 0, label: "I don't have an opinion" },
        { value: 100, label: 'Love' },
    ];

    const [dropdownOpen, dropdownOpenHandlers] = useDisclosure(false);
    const [searchValue, setSearchValue] = useState<string>('');
    const [userInterests, setUserInterests] = useState<InterestData[]>(gotInterests);
    const [addingInterest, setAddingInterest] = useState<string>('');
    const [sliderValue, setSliderValue] = useState<number>(0);

    const userInterestsMap: Record<string, boolean> = Object.assign({}, ...userInterests.map(interest => ({ [interest.name]: true })));

    const filteredInterests = allInterests.filter(name => !userInterestsMap[name]);

    const focusInterest = (item: AutocompleteItem) => {
        setAddingInterest(item.value);
    };

    const addInterest = () => {
        setAddingInterest('');
        setSearchValue('');
        setUserInterests([...userInterests, { name: addingInterest, score: sliderValue }]);
    };

    const cancelInterest = () => {
        setAddingInterest('');
        setSearchValue('');
    };

    const rows = userInterests.map(interest => (
        <tr key={interest.name}>
            <td>{interest.name}</td>
            <td>{interest.score}</td>
        </tr>
    ));

    return (
        <Stack spacing={16}>
            <Text size='md' weight='bold' color={theme.colors._gray[4]} mb='12px'>
                What are your interests?
            </Text>
            {/* <Group mb='12px'> */}
            <Autocomplete
                mt={4}
                className='shadow-sm'
                label='Add new interest'
                value={searchValue}
                onChange={setSearchValue}
                onDropdownOpen={dropdownOpenHandlers.open}
                onDropdownClose={dropdownOpenHandlers.close}
                onItemSubmit={focusInterest}
                data={filteredInterests}
                transition='slide-up'
                transitionDuration={250}
                transitionTimingFunction='ease'
            />
            {addingInterest !== '' ? (
                <Box className='relative mt-[-16px]'>
                    <Stack className='absolute w-full h-[200]'>
                        <Text mt={12}>How do you feel about {addingInterest}?</Text>
                        <Slider className='shadow-sm' min={-100} max={100} defaultValue={0} marks={sliderMarks} onChangeEnd={setSliderValue} />
                        <Group className='mt-10'>
                            <Button className='w-24 shadow-md' variant='outline' onClick={addInterest}>
                                Save
                            </Button>
                            <Button className='w-24 shadow-md' variant='outline' color='red' onClick={cancelInterest}>
                                Cancel
                            </Button>
                        </Group>
                    </Stack>
                </Box>
            ) : null}
            {/* </Group> */}
            <motion.div animate={addingInterest !== '' || dropdownOpen ? { marginTop: '200px' } : {}} transition={{ ease: 'easeOut' }}>
                <Table className='shadow-md' striped horizontalSpacing='lg'>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Fondness</th>
                        </tr>
                    </thead>
                    <tbody>{rows}</tbody>
                </Table>
            </motion.div>
            <NumberInput
                defaultValue={0}
                min={0}
                className='shadow-sm'
                max={10}
                placeholder='Match filter'
                label='Match filter'
                description='From 0 to 10, reduce match frequency by ignoring lower quality matches'
            />
        </Stack>
    );
};

export default Matching;
