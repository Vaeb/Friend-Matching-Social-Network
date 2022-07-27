import React, { useEffect, useState } from 'react';
import { useMantineTheme, Modal, TextInput, TextInputProps } from '@mantine/core';
import { useHotkeys } from '@mantine/hooks';
import { BiSearch as IconSearch } from 'react-icons/bi';
import shallow from 'zustand/shallow';

import { useGetUserByHandleQuery } from '../generated/graphql';
import { useAppStore } from '../state';

const SearchModal = () => {
    const theme = useMantineTheme();
    const [opened, setOpened] = useState(false);
    const [knownBad, setKnownBad] = useState({});
    const [value, setValue] = useState('');
    const [handle, setHandle] = useState('');
    const [{ data: userData, fetching: userFetching }] = useGetUserByHandleQuery({ variables: { handle } });
    const { setView, setSetOpened } = useAppStore(state => ({ view: state.left.view, setView: state.setView, setSetOpened: state.setSetSearchOpened }), shallow);

    const user = !userFetching ? userData?.getUserByHandle : undefined;

    useEffect(() => {
        console.log('NEW setSetOpened !!!!!!!!!!!!!!!');
        setSetOpened((val) => { setValue(''); setHandle(''); setOpened(val); });
    }, [setSetOpened]);

    useHotkeys([
        ['ctrl+K', () => {
            if (!opened) {
                setValue('');
                setHandle('');
            }
            setOpened(!opened);
        }],
    ]);

    if (handle !== '') {
        // setHandle('');
        if (user === null && !knownBad[handle]) {
            console.log('setting known bad...');
            setKnownBad({ ...knownBad, [handle]: true });
        } else if (user != null && value !== '') {
            setHandle('');
            setView('user', null, user.id);
            setOpened(false);
        }
    }

    const onKeyDown = (props: TextInputProps & React.RefAttributes<HTMLInputElement>) => {
        const { key } = props;
        if (key === 'Enter') {
            setHandle(value);
        }
    };

    return (
        <Modal opened={opened} onClose={() => setOpened(false)} centered withCloseButton={false} radius='md' overlayOpacity={0.75}>
            <TextInput
                autoComplete='off'
                // className=''
                // classNames={{
                //     input: 'focus:border-0 bg-red-500',
                // }}
                styles={{
                    input: {
                        '::placeholder': {
                            fontSize: '18px',
                            color: theme.colors._gray[6],
                        },
                        ':focus, :focus-within, :focus-visible': {
                            outline: 'none',
                            border: 'none',
                        },
                        outline: 'none',
                        border: 'none',
                        opacity: 1,
                        height: '70px',
                        minHeight: '70px',
                        lineHeight: '68px',
                        color: theme.colors._gray[8],
                    },
                }}
                size='xl'
                icon={<IconSearch style={{ width: '30px', height: '30px' }} color={theme.colors._gray[8]} />}
                radius='md'
                placeholder='Find user by username or email'
                value={value}
                onChange={event => setValue(event.currentTarget.value)}
                onKeyDown={onKeyDown}
                error={knownBad[value]}
            />
        </Modal>
    );
};

export default SearchModal;