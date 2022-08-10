import React, { useState } from 'react';
import {
    Box, Button, createStyles, PasswordInput, Select, TextInput, 
} from '@mantine/core';
import { useForm } from '@mantine/form';
import NextLink from 'next/link';
import { useRouter } from 'next/router';

import Page from '../components/Page';
import { useGetUniversitiesQuery, useRegisterMutation } from '../generated/graphql';
import { mapErrors } from '../utils/mapErrors';
import { useAppStore } from '../state';
import { useMobileDetect } from '../utils/useMobileDetect';
import { CustomScroll, CustomScroll2 } from '../components/CustomScroll';
import PaddedArea from '../components/PaddedArea';

interface RegisterProps {}

const useStyles = createStyles(theme => ({
    extraPadding: {
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 28,
        paddingBottom: 28,
  
        // Static media query
        '@media (min-width: 768px)': {
            paddingLeft: 32,
            paddingRight: 32,
            paddingTop: 28,
            paddingBottom: 28,
        },
    },
}));

const Register: React.FC<RegisterProps> = ({}) => {
    // const validateUsername = (value: string) => value && value.length > 3 ? undefined : 'Username must be at least 3 characters';
    const router = useRouter();
    const { classes } = useStyles();

    const [, register] = useRegisterMutation();
    const [universitiesQuery] = useGetUniversitiesQuery();
    const universities = !universitiesQuery.fetching ? universitiesQuery?.data?.getUniversities : [];

    const setView = useAppStore(state => state.setView);
    // const resetClient = useMiscStore(state => state.resetClient);

    const [isLoading, setIsLoading] = useState(false);
    const [universityId, setUniversityId] = useState('');
    const device = useMobileDetect();

    const isMobile = device.isMobile();
    const isServer = typeof window === 'undefined';
    console.log('CUSTOM CHECK SSR:', isServer);

    const universityValues = universities.map(university => ({ value: String(university.id), label: university.name }));

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

    return ( // h-[625px]
        <Page type='center' needsAuth={false}>
            <Box className={'flex flex-col bg-_blackT-600 w-[450px] max-w-full h-[617px] max-h-full md:mb-[80px] rounded-md shadow-_box5'}>
                <CustomScroll2 type='never'>
                    <PaddedArea className={classes.extraPadding}>
                        <Box className='text-xl font-semibold' mb={4}>
                            <p className=''>Welcome!</p>
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
                                        autoFocus={!isMobile}
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
                    </PaddedArea>
                </CustomScroll2>
            </Box>
        </Page>
    );
};

export default Register;
