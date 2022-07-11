import React, { useState } from 'react';
import { Box, Button, PasswordInput, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import NextLink from 'next/link';
import { useRouter } from 'next/router';

import Page from '../components/Page';
import { useRegisterMutation } from '../generated/graphql';
import { mapErrors } from '../utils/mapErrors';

interface RegisterProps {}

const Register: React.FC<RegisterProps> = ({}) => {
    // const validateUsername = (value: string) => value && value.length > 3 ? undefined : 'Username must be at least 3 characters';
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [readonly, setReadonly] = useState(true);
    const [, register] = useRegisterMutation();

    const isServer = typeof window === 'undefined';
    console.log('CUSTOM CHECK SSR:', isServer);

    const form = useForm({
        initialValues: {
            username: '',
            email: '',
            password: '',
            // confirmPassword: '',
            name: '',
        },
        validate: {
            username: value => (!value.length ? 'Username is required' : null),
            email: value => (!value.length ? 'Email is required' : null),
            password: value => (!value.length ? 'Password is required' : null),
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
        });
        if (response.data?.register.errors) {
            form.setErrors(mapErrors(response.data.register.errors));
            setIsLoading(false);
            return;
        }
        console.log(values, response.data?.register);
        router.push('/');
    };

    return ( // T6
        <Page type='center' needsAuth={false}>
            <Box className='bg-_blackT-600 min-w-[21vw] rounded-md shadow-_box5' p='30px'>
                <Box className='text-xl font-semibold' mb={4}>
                    <p>Welcome!</p>
                    <p>Please register an account.</p>
                    <Box className='text-sm font-medium text-_sky-500' mt={1}>
                        <NextLink href='/login'>
                            <a>
                                If you have an account, login.
                            </a>
                        </NextLink>
                    </Box>
                </Box>
                <Box mt={14}>
                    <form onSubmit={form.onSubmit(onSubmit)}>
                        <Box>
                            <TextInput name='username' label='USERNAME' placeholder='Username' autoComplete='new-password' {...form.getInputProps('username')} />
                        </Box>
                        <Box mt={9}>
                            <TextInput name='email' label='EMAIL' placeholder='your@email.com' autoComplete='new-password' {...form.getInputProps('email')} />
                        </Box>
                        <Box mt={9}>
                            <PasswordInput name='password' label='PASSWORD' placeholder='*********' autoComplete='new-password' {...form.getInputProps('password')} />
                        </Box>
                        <Box mt={9}>
                            <TextInput name='name' label='PREFERRED NAME' placeholder='John' autoComplete='new-password' {...form.getInputProps('name')} />
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
