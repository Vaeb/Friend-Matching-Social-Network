import React, { useState } from 'react';
import { Box, Button, createStyles, PasswordInput, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import NextLink from 'next/link';

import Page from '../components/Page';
import { useRouter } from 'next/router';
import { useLoginMutation } from '../generated/graphql';
import { mapErrors } from '../utils/mapErrors';
import { useAppStore, useMiscStore } from '../state';
import { useMobileDetect } from '../utils/useMobileDetect';
import { CustomScroll2 } from '../components/CustomScroll';
import PaddedArea from '../components/PaddedArea';
import { useMediaQuery } from '@mantine/hooks';

interface LoginProps {}

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

const Login: React.FC<LoginProps> = ({}) => {
    const router = useRouter();
    const { classes } = useStyles();
    const [, login] = useLoginMutation();

    const setView = useAppStore(state => state.setView);
    // const resetClient = useMiscStore(state => state.resetClient);

    const [isLoading, setIsLoading] = useState(false);
    const device = useMobileDetect();

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

    const isMobile = device.isMobile();
    const isDesktop = device.isDesktop();

    const onSubmit = async (values: any) => {
        setIsLoading(true);
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
        setView('base', 'all');
        router.push('/');
    };

    return ( // h-[319px]
        <Page type='center' needsAuth={false}>
            <Box className={'flex flex-col bg-_blackT-600 w-[450px] max-w-full h-[311px] max-h-full h755:mb-[80px] rounded-md shadow-_box5'}>
                <CustomScroll2 type='never'>
                    <PaddedArea className={classes.extraPadding}>
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
                                    <TextInput autoFocus={!isMobile} name='handle' label='USERNAME OR EMAIL' placeholder='' {...form.getInputProps('handle')} />
                                </Box>
                                <Box mt={10}>
                                    <PasswordInput name='password' label='PASSWORD' placeholder='' {...form.getInputProps('password')} />
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

export default Login;
