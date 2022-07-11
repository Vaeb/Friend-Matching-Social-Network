import React, { useState } from 'react';
import { Box, Button, Text } from '@mantine/core';
// import { Button, Text } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import NextLink from 'next/link';
import { useRouter } from 'next/router';

import { InputField } from '../components/InputField';
import Page from '../components/Page';
import { useRegisterMutation } from '../generated/graphql';
import { mapErrors } from '../utils/mapErrors';

const ItemBoxShadow = `
    0 2.3px 3.6px #4f4f4f,
    0 .3px 10px rgba(0, 0, 0, 0.046),
    0 15.1px 24.1px rgba(0, 0, 0, 0.051),
    0 30px 40px rgba(0, 0, 0, 0.5)
`;

interface RegisterProps {}

const Register: React.FC<RegisterProps> = ({}) => {
    // const validateUsername = (value: string) => value && value.length > 3 ? undefined : 'Username must be at least 3 characters';
    const router = useRouter();
    const [readonly, setReadonly] = useState(true);
    const [, register] = useRegisterMutation();

    const isServer = typeof window === 'undefined';
    console.log('CUSTOM CHECK SSR:', isServer);

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
                <Formik
                    initialValues={{ username: '', name: '', email: '', password: '' }}
                    onSubmit={async (values, actions) => {
                        const response = await register({
                            username: values.username,
                            name: values.name,
                            email: values.email,
                            password: values.password,
                        });
                        if (response.data?.register.errors) {
                            actions.setErrors(mapErrors(response.data.register.errors));
                            return;
                        }
                        console.log(values, response.data?.register);
                        router.push('/');
                    }}
                >
                    {props => (
                        <Form autoComplete='new-password'>
                            <Box>
                                <InputField name='username' label='USERNAME' placeholder='' type='text' readOnly={readonly} onFocus={() => setReadonly(false)}  />
                            </Box>
                            <Box mt={4}>
                                <InputField name='email' label='EMAIL' placeholder='' autoComplete='new-password' />
                            </Box>
                            <Box mt={4}>
                                <InputField name='password' label='PASSWORD' placeholder='' type='password' autoComplete='new-password' />
                            </Box>
                            <Box mt={4}>
                                <InputField name='name' label='PREFERRED NAME' placeholder='' autoComplete='new-password' />
                            </Box>
                            <Button className='w-full' mt={8} type='submit' colorScheme='blue' isLoading={props.isSubmitting}>
                                Continue
                            </Button>
                        </Form>
                    )}
                </Formik>
            </Box>
        </Page>
    );
};

export default Register;
