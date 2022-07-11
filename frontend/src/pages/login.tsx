import React, { useState } from 'react';
import { Box, Button, PasswordInput, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import NextLink from 'next/link';

import Page from '../components/Page';
import { useRouter } from 'next/router';
import { useLoginMutation } from '../generated/graphql';
import { mapErrors } from '../utils/mapErrors';

interface LoginProps {}

const Login: React.FC<LoginProps> = ({}) => {
    const router = useRouter();
    const [, login] = useLoginMutation();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm({
        initialValues: {
            handle: '',
            password: '',
        },
        validate: {
            handle: value => (!value.length ? 'Username is required' : null),
            password: value => (!value.length ? 'Password is required' : null),
        },
    });

    const onSubmit = async (values: any) => {
        setIsLoading(true);
        console.log('qq', values);
        const response = await login({
            handle: values.handle,
            password: values.password,
        });
        if (response.data?.login.errors) {
            form.setErrors(mapErrors(response.data.login.errors));
            setIsLoading(false);
            return;
        }
        console.log(values, response.data?.login);
        router.push('/');
    };

    return (
        <Page type='center' needsAuth={false}>
            <Box className='bg-_blackT-600 min-w-[21vw] rounded-md shadow-_box5' p='30px'>
                <Box className='text-xl font-semibold' mb={4}>
                    <p>Welcome back!</p>
                    {/* <p>Please login.</p> */}
                    <Box className='text-sm font-medium text-_sky-500' mt={1}>
                        <NextLink href='/register'>
                            <a>If you&apos;re new, create an account.</a>
                        </NextLink>
                    </Box>
                </Box>
                <Box mt={14}>
                    <form onSubmit={form.onSubmit(onSubmit)}>
                        <Box>
                            <TextInput autoFocus name='handle' label='USERNAME OR EMAIL' placeholder='' {...form.getInputProps('handle')} />
                        </Box>
                        <Box mt={9}>
                            <PasswordInput name='password' label='PASSWORD' placeholder='' {...form.getInputProps('password')} />
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

export default Login;
