import React, { useState } from 'react';
import { Box, Button, PasswordInput, Select, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import NextLink from 'next/link';
import { useRouter } from 'next/router';

import Page from '../components/Page';
import { useGetUniversitiesQuery, useRegisterMutation } from '../generated/graphql';
import { mapErrors } from '../utils/mapErrors';
import { useAppStore, useMiscStore } from '../state';

interface RegisterProps {}

const Register: React.FC<RegisterProps> = ({}) => {
    // const validateUsername = (value: string) => value && value.length > 3 ? undefined : 'Username must be at least 3 characters';
    const router = useRouter();

    const [, register] = useRegisterMutation();
    const [universitiesQuery] = useGetUniversitiesQuery();
    const universities = !universitiesQuery.fetching ? universitiesQuery?.data?.getUniversities : [];

    const setView = useAppStore(state => state.setView);
    // const resetClient = useMiscStore(state => state.resetClient);

    const [isLoading, setIsLoading] = useState(false);
    const [universityId, setUniversityId] = useState('');

    const universityValues = universities.map(university => ({ value: String(university.id), label: university.name }));

    const isServer = typeof window === 'undefined';
    console.log('CUSTOM CHECK SSR:', isServer);

    const form = useForm({
        initialValues: {
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            universityId: '',
            name: '',
        },
        validate: {
            username: value => (!value.length ? 'Username is required' : null),
            email: value => (!value.length ? 'Email is required' : null),
            password: value => (!value.length ? 'Password is required' : null),
            confirmPassword: (value, { password }) => (!value.length ? 'Confirm password is required' : value !== password ? 'Passwords must match' : null),
            universityId: value => (!value.length ? 'University is required' : null),
            name: value => (!value.length ? 'Name is required' : null),
        },
    });

    const onSubmit = async (values: any) => {
        setIsLoading(true);
        const response = await register({
            username: values.username,
            name: values.name,
            email: values.email,
            password: values.password,
            universityId: Number(values.universityId),
        });
        if (response.data?.register.errors) {
            form.setErrors(mapErrors(response.data.register.errors));
            setIsLoading(false);
            return;
        }
        console.log(values, response.data?.register);
        setView('base', 'all');
        router.push('/');
    };

    return (
        // T6
        <Page type='center' needsAuth={false}>
            <Box className='bg-_blackT-600 min-w-[450px] rounded-md shadow-_box5 py-8 px-8'>
                <Box className='text-xl font-semibold' mb={4}>
                    <p>Welcome!</p>
                    <p>Please register an account.</p>
                    <Box className='text-sm font-medium text-_sky-500' mt={1}>
                        <NextLink href='/login'>
                            <a>If you have an account, login.</a>
                        </NextLink>
                    </Box>
                </Box>
                <Box mt={14}>
                    <form onSubmit={form.onSubmit(onSubmit)}>
                        <Box>
                            <TextInput
                                autoFocus
                                name='username'
                                label='USERNAME'
                                placeholder='Username'
                                autoComplete='new-password'
                                {...form.getInputProps('username')}
                            />
                        </Box>
                        <Box mt={10}>
                            <TextInput
                                name='email'
                                label='PERSONAL EMAIL'
                                placeholder='your@email.com'
                                autoComplete='new-password'
                                {...form.getInputProps('email')}
                            />
                        </Box>
                        <Box mt={10}>
                            <PasswordInput
                                name='password'
                                label='PASSWORD'
                                placeholder='*********'
                                autoComplete='new-password'
                                {...form.getInputProps('password')}
                            />
                        </Box>
                        <Box mt={10}>
                            <PasswordInput
                                name='confirmPassword'
                                label='CONFIRM PASSWORD'
                                placeholder='*********'
                                autoComplete='new-password'
                                {...form.getInputProps('confirmPassword')}
                            />
                        </Box>
                        <Box mt={10}>
                            <Select
                                name='universityId'
                                // variant='filled'
                                label='CHOOSE YOUR UNIVERSITY'
                                value={universityId}
                                onChange={setUniversityId}
                                placeholder='...'
                                searchable
                                nothingFound='No options'
                                data={universityValues}
                                {...form.getInputProps('universityId')}
                            />
                        </Box>
                        <Box mt={10}>
                            <TextInput
                                name='name'
                                label='PREFERRED NAME'
                                placeholder='John'
                                autoComplete='new-password'
                                {...form.getInputProps('name')}
                            />
                        </Box>
                        <Button className='w-full' mt={20} type='submit' color='blue' loading={isLoading}>
                            Continue
                        </Button>
                    </form>
                </Box>
            </Box>
        </Page>
    );
};

export default Register;
