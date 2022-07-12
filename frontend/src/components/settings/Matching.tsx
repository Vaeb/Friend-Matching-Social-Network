import {
    Accordion,
    Autocomplete,
    AutocompleteItem,
    Box,
    Button,
    Group,
    Highlight,
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
import { Interest, useAddUserInterestsMutation, useGetInterestsQuery, useGetUserInterestsQuery, useMeQuery, UserInterest } from '../../generated/graphql';

type InterestData = {
    name: string;
    score: number;
};

type InterestResult = Pick<Interest, 'name'> & Partial<Pick<Interest, 'id'>>;
type UserInterestResult = Pick<UserInterest, 'score'> & { interest: InterestResult };

const Matching = ({ userId }: { userId: number }) => {
    const theme = useMantineTheme();

    const [{ data: allInterestsParent, fetching: allInterestsFetching }] = useGetInterestsQuery();
    const [{ data: origUserInterestsParent, fetching: origUserInterestsFetching }] = useGetUserInterestsQuery({ variables: { userId } });
    const [, addInterestRequest] = useAddUserInterestsMutation();

    const allInterests = allInterestsParent?.getInterests || [];
    const origUserInterests = origUserInterestsParent?.getUserInterests || [];

    const sliderMarks = [
        { value: -100, label: 'Hate' },
        { value: 0, label: "I don't have an opinion" },
        { value: 100, label: 'Love' },
    ];

    const [dropdownOpen, dropdownOpenHandlers] = useDisclosure(false);
    const [searchValue, setSearchValue] = useState<string>('');
    const [userInterests, setUserInterests] = useState<UserInterestResult[]>(origUserInterests);
    const [addingInterest, setAddingInterest] = useState<string>('');
    const [sliderValue, setSliderValue] = useState<number>(0);

    if (userInterests.length === 0 && origUserInterests.length > 0) { // Can add check that userInterests has never been > 0 (for interest removal)
        setUserInterests(origUserInterests);
    }

    const userInterestsMap: Record<string, boolean> = Object.assign({}, ...userInterests.map(userInterest => ({ [userInterest.interest.name]: true })));

    const filteredInterests = allInterests.map(interest => interest.name).filter(name => !userInterestsMap[name]);

    const focusInterest = (item: AutocompleteItem) => {
        setAddingInterest(item.value);
    };

    const addInterest = async () => {
        setAddingInterest('');
        setSearchValue('');
        setUserInterests([...userInterests, { interest: { name: addingInterest }, score: sliderValue }]);
        const interestId = allInterests.find(interest => interest.name === addingInterest)!.id;
        const { data } = await addInterestRequest({
            userId,
            userInterests: [{ interestId, score: sliderValue }],
        });
        if (!data?.addUserInterests.ok) {
            console.log('GRAPHQL ERRORS:', data?.addUserInterests.errors);
            return;
        }
        console.log('RESPONSE:', data?.addUserInterests.ok);
    };

    const cancelInterest = () => {
        setAddingInterest('');
        setSearchValue('');
    };

    const rows = userInterests.map(userInterest => (
        <tr key={userInterest.interest.name}>
            <td>{userInterest.interest.name}</td>
            <td>{userInterest.score}</td>
        </tr>
    ));

    return (
        <Stack spacing={16}>
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
                        <Highlight
                            mt={12}
                            highlight={addingInterest}
                            highlightStyles={{
                                backgroundImage: theme.fn.linearGradient(45, theme.colors.cyan[5], theme.colors.indigo[5]),
                                fontWeight: 700,
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >{`How do you feel about ${addingInterest}?`}</Highlight>
                        <Slider
                            className='shadow-sm'
                            min={-100}
                            max={100}
                            defaultValue={0}
                            marks={sliderMarks}
                            onChangeEnd={setSliderValue}
                        />
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
