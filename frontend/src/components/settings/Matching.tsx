import {
    Autocomplete,
    AutocompleteItem,
    Box,
    Button,
    Divider,
    Group,
    Highlight,
    NumberInput,
    Select,
    Slider,
    Stack,
    Switch,
    Table,
    Text,
    TextInput,
    useMantineTheme,
} from '@mantine/core';
import { useDisclosure, useLocalStorage } from '@mantine/hooks';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    MeQuery,
    UpdateMatchSettingsMutationVariables,
    UpdateMeMutationVariables,
    useAddUserInterestMutation,
    useGetInterestsQuery,
    useGetUserInterestsQuery,
    useUpdateMatchSettingsMutation,
    useUpdateMeMutation,
} from '../../generated/graphql';
import { properToSlider, sliderToProper } from '../../utils/convertScore';
import { useMeStore } from '../../state';

// type InterestResult = Pick<Interest, 'name'> & Partial<Pick<Interest, 'id'>>;
// type UserInterestResult = Pick<UserInterest, 'score'> & { interest: InterestResult };

export const desc = 'Meet new people';

const matchFreqPhrase = (days) => {
    if (days == 0) return 'no automatic matches';
    if (days == 1) return 'at most one automatic match every day';
    return `at most one automatic match every ${days} days`;
};

const Matching = ({ me }: { me: MeQuery['me'] }) => {
    const theme = useMantineTheme();

    const refreshNextMatch = useMeStore(state => state.refreshNextMatch);

    const [{ data: allInterestsParent, fetching: allInterestsFetching }] = useGetInterestsQuery();
    const [{ data: origUserInterestsParent, fetching: origUserInterestsFetching }] = useGetUserInterestsQuery();
    const [, sendAddUserInterest] = useAddUserInterestMutation();
    const [, doUpdateMe] = useUpdateMeMutation();
    const [, doUpdateMatchSettings] = useUpdateMatchSettingsMutation();

    const allInterests = allInterestsParent?.getInterests || [];
    const userInterests = origUserInterestsParent?.getUserInterests || [];

    const sliderMarks = [
        { value: 0, label: 'Hate' },
        { value: 50, label: "I don't have an opinion" },
        { value: 100, label: 'Love' },
    ];

    const [dropdownOpen, dropdownOpenHandlers] = useDisclosure(false);
    const [searchValue, setSearchValue] = useState<string>('');
    // const [userInterests, setUserInterests] = useState<UserInterestResult[]>(origUserInterests);
    const [addingInterestText, setAddingInterestText] = useState<string>('');
    const [addingInterest, setAddingInterest] = useState<string>('');
    const [addingType, setAddingType] = useState<string>('');
    const [sliderValue, setSliderValue] = useState<number>(50);
    const [autoFreqNow, setAutoFreqNow] = useState<number>(me.autoFreq || 0);
    const [matchQualityNow, setMatchQualityNow] = useState<number>(me.matchQuality || 0);

    // if (userInterests.length === 0 && origUserInterests.length > 0) { // Can add check that userInterests has never been > 0 (for interest removal)
    //     setUserInterests(origUserInterests);
    // }

    const userInterestsMap: Record<string, any> = Object.assign(
        {},
        ...userInterests.map(userInterest => ({ [userInterest.interest.name]: userInterest }))
    );

    const filteredInterests = allInterests.map(interest => interest.name).filter(name => !userInterestsMap[name]);

    const focusInterest = (item: string) => {
        setSliderValue(50);
        setAddingInterest(item);
        setAddingType('new');
    };

    const setChangeInterest = (name: string) => {
        setSearchValue('');
        setSliderValue(properToSlider(userInterestsMap[name].score));
        setAddingInterest(name);
        setAddingType('existing');
    };

    const addInterest = async (override = false, score = sliderValue) => {
        setAddingInterest('');
        setSearchValue('');
        const interestId = allInterests.find(interest => interest.name === addingInterest)!.id;
        score = sliderToProper(score);
        const { data } = await sendAddUserInterest({
            userInterest: { interestId, score },
            override,
        });
        if (!data?.addUserInterest.ok) {
            console.log('GRAPHQL ERRORS:', data?.addUserInterest.errors);
            return;
        }
        console.log('RESPONSE:', data?.addUserInterest.ok);
    };

    const deleteInterest = () => {
        addInterest(true, -1);
    };

    const cancelInterest = () => {
        setAddingInterest('');
        setSearchValue('');
    };

    type a = boolean | undefined;

    const updateMe = async <T extends boolean = false>(
        varName: T extends true ? keyof UpdateMatchSettingsMutationVariables : keyof UpdateMeMutationVariables,
        varValue: any,
        isMatchSetting?: T,
        callback?: () => void
    ) => {
        console.log('Updating user (matching)...', varName, varValue);

        const resField = isMatchSetting ? 'updateMatchSettings' : 'updateMe';
        
        const result = isMatchSetting
            ? (await doUpdateMatchSettings({ [varName]: varValue }))
            : (await doUpdateMe({ [varName]: varValue }));

        if (result.data?.[resField].ok) {
            if (callback) await callback();
            if (varName === 'autoFreq') refreshNextMatch(varValue);
            console.log('Update success');
        } else {
            console.log('Update failed:', result.data?.[resField].errors);
        }
    };

    const topRow = (
        <tr className='bg-_black-600'>
            <th>Name</th>
            <th>Score</th>
        </tr>
    );
    const rows = userInterests.map(({ interest: { name }, score }) => (
        <tr
            className={`${
                score > 50
                    ? 'bg-green-800/[.4] hover:bg-green-800/[.6] text-zinc-300'
                    : score < 50
                        ? 'bg-red-800/[.4] hover:bg-red-800/[.6] text-zinc-300'
                        : ''
            } cursor-pointer`}
            key={name}
            onClick={() => setChangeInterest(name)}
        >
            <td>{name}</td>
            <td>{properToSlider(score)}</td>
        </tr>
    ));

    return (
        <Stack spacing={18}>
            <Stack spacing={0}>
                <div className='flex justify-between'>
                    <Text className='text-[14px] font-[500] mb-[8px] text-_label'>Friend matching</Text>
                    <div className='flex gap-1'>
                        <Switch onLabel='ON' offLabel='OFF' size='lg' checked={me.matchingEnabled} onChange={e => updateMe('matchingEnabled', e.currentTarget.checked)} />
                    </div>
                </div>
                <Text className='text-[13px] font-[400] text-_gray-600'>Meet people with similar interests using our matching algorithm!</Text>
            </Stack>

            <Divider size='xs' color={theme.colors._dividerT2[0]} />
            {/* <Group mb='12px'> */}
            <Stack spacing={2}>
                <Text className='text-[14px] font-[500] text-_label'>Add new interest</Text>
                <Select
                    mt={4}
                    className='shadow-sm'
                    classNames={{ dropdown: 'pb-[0px]' }}
                    placeholder='Interest name...'
                    searchable
                    clearable
                    nothingFound='No interests'
                    value={addingInterestText}
                    onChange={focusInterest}
                    maxDropdownHeight={222}
                    onDropdownOpen={() => {
                        // if (!dropdownOpen) {
                        //     setSearchValue('');
                        // }
                        console.log('opening');
                        dropdownOpenHandlers.open();
                    }}
                    onDropdownClose={dropdownOpenHandlers.close}
                    // onItemSubmit={focusInterest}
                    data={filteredInterests}
                    transition='slide-up'
                    transitionDuration={250}
                    transitionTimingFunction='ease'
                />
            </Stack>
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
                            min={0}
                            max={100}
                            step={1}
                            defaultValue={addingType === 'new' ? 50 : userInterestsMap[addingInterest]?.score}
                            marks={sliderMarks}
                            value={sliderValue}
                            onChange={setSliderValue}
                        />
                        <Group className='mt-10'>
                            <Button
                                className='w-24 shadow-md'
                                variant='outline'
                                onClick={() => addInterest(addingType === 'new' ? false : true)}
                            >
                                Save
                            </Button>
                            {addingType === 'existing' ? (
                                <Button className='w-24 shadow-md' variant='outline' color='red' onClick={deleteInterest}>
                                    Delete
                                </Button>
                            ) : null}
                            <Button className='w-24 shadow-md' variant='outline' color='red' onClick={cancelInterest}>
                                Cancel
                            </Button>
                        </Group>
                    </Stack>
                </Box>
            ) : null}
            {/* </Group> */}
            <motion.div animate={addingInterest !== '' || dropdownOpen ? { marginTop: '222px' } : {}} transition={{ ease: 'easeOut' }}>
                <Table className='shadow-md' horizontalSpacing='lg'>
                    <thead>{topRow}</thead>
                    <tbody>{rows}</tbody>
                </Table>
            </motion.div>

            <Divider size='xs' color={theme.colors._dividerT2[0]} />
            <Text className='text-[14px] font-[700] text-_gray-400 uppercase'>{me.uni} SETTINGS</Text>
            <Stack spacing={2}>
                <Text className='text-[14px] font-[500] text-_label'>Automatic match frequency (days)</Text>
                <div className='flex gap-1 items-center'>
                    <Slider
                        className='shadow-sm mx-1'
                        classNames={{ root: 'grow', markLabel: 'text-[13px] font-[400] text-_gray-600' }}
                        defaultValue={me.autoFreq || 0}
                        value={autoFreqNow}
                        onChange={setAutoFreqNow}
                        min={0}
                        max={31}
                        step={1}
                        marks={[{ value: 0, label: 'Off' }, { value: 31, label: '31' }]}
                        // value={sliderValue}
                        // onChange={setSliderValue}
                    />
                    <Button size='sm' variant='filled' color='grape' onClick={() => updateMe('autoFreq', autoFreqNow, true)}>Save</Button>
                </div>
                <Text className='mt-[12px] text-[13px] font-[400] text-_gray-600'>
                    How often do you want to receive matches? You are currently receiving {matchFreqPhrase(me.autoFreq)}.
                </Text>
            </Stack>
            <Stack spacing={0}>
                <div className='flex justify-between'>
                    <Text className='text-[14px] font-[500] text-_label'>Manual matching</Text>
                    <div className='flex gap-1'>
                        <Switch onLabel='ON' offLabel='OFF' size='lg' checked={me.manualEnabled} onChange={e => updateMe('manualEnabled', e.currentTarget.checked, true)} />
                    </div>
                </div>
                <Text className='text-[13px] font-[400] text-_gray-600'>Instantly generate a match (at most once per day), and allow others to do the same with you.</Text>
            </Stack>
            <Stack spacing={0}>
                <div className='flex justify-between'>
                    <Text className={`${me.uniConfirmed ? '' : 'opacity-40'} text-[14px] font-[500] mb-[8px] text-_label`}>Confirmed students only</Text>
                    <div className='flex gap-1'>
                        <Switch
                            onLabel='ON'
                            offLabel='OFF'
                            size='lg'
                            checked={me.studentsOnly}
                            onChange={e => updateMe('studentsOnly', e.currentTarget.checked, true)}
                            disabled={!me.uniConfirmed}
                        />
                    </div>
                </div>
                <Text className={`${me.uniConfirmed ? '' : 'opacity-40'} text-[13px] font-[400] text-_gray-600`}>Only match with confirmed {me.uni} students.</Text>
            </Stack>

            <Divider size='xs' color={theme.colors._dividerT2[0]} />
            <Stack spacing={2}>
                <Text className='text-[14px] font-[500] text-_label'>Minimum match quality</Text>
                <div className='flex gap-1'>
                    <Slider
                        className='shadow-sm mx-1'
                        classNames={{ root: 'grow', markLabel: 'text-[13px] font-[400] text-_gray-600' }}
                        defaultValue={me.autoFreq || 0}
                        value={matchQualityNow}
                        onChange={setMatchQualityNow}
                        min={0}
                        max={10}
                        step={1}
                        marks={[{ value: 0, label: '0' }, { value: 10, label: '10' }]}
                        // value={sliderValue}
                        // onChange={setSliderValue}
                    />
                    <Button size='sm' variant='filled' color='grape' onClick={() => updateMe('matchQuality', matchQualityNow)}>Save</Button>
                </div>
                <Text className='mt-[12px] text-[13px] font-[400] text-_gray-600'>
                    We prioritize generating the best matches for everyone, but some matches will be better than others.
                    This setting will skip matches that are lower quality.
                    Current setting: {me.matchQuality}.
                </Text>
            </Stack>
            {/* <Text>
                Allow timeline posts to be ordered based on your interest compatibility with the author. Allows others to use your posts for
                the same purpose.
            </Text>
            <Switch
                className='shadow-sm'
                label={'Allow your interest compatibility with other users to be utilised when ordering timeline posts.'
                    + 'Allows other users to order your posts using the same approach.'}
            /> */}
        </Stack>
    );
};

export default Matching;
