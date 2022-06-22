import React, { useState } from 'react';
import { Formik, Form } from 'formik';
import { Box, Button, Text } from '@chakra-ui/react';
import NextLink from 'next/link';

import { InputField } from '../components/InputField';
import Page from '../components/Page';
import { useRegisterMutation } from '../generated/graphql';

const ItemBoxShadow = `
    0 2.3px 3.6px #4f4f4f,
    0 .3px 10px rgba(0, 0, 0, 0.046),
    0 15.1px 24.1px rgba(0, 0, 0, 0.051),
    0 30px 40px rgba(0, 0, 0, 0.5)
`;

interface RegisterProps {}

const Register: React.FC<RegisterProps> = ({}) => {
    const validateUsername = (value: string) => value && value.length > 3 ? undefined : 'Username must be at least 3 characters';
    const [readonly, setReadonly] = useState(true);
    const [, register] = useRegisterMutation();

    return (
        <Page type='center'>
            <Box bg="rgba(79,84,92,.6)" p="30px" minW="21vw" borderRadius="5px" boxShadow={ItemBoxShadow}>
                <Box fontSize="xl" fontWeight="semibold" mb={4}>
                    <Text>Welcome!</Text>
                    <Text>Please register an account.</Text>
                    <Box mt={1} fontSize="sm" fontWeight="medium" color="#00aff4">
                        <NextLink href="/login">
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
                        if (response.data?.register.error) {
                            actions.setErrors(response.data.register.error);
                        }
                        console.log(values);
                        // actions.setSubmitting(false);
                    }}
                >
                    {props => (
                        <Form autoComplete='new-password'>
                            <Box>
                                <InputField name="username" label="USERNAME" placeholder="" type="text" readOnly={readonly} onFocus={() => setReadonly(false)}  />
                            </Box>
                            <Box>
                                <InputField name="name" label="NAME" placeholder="" autoComplete='new-password' />
                            </Box>
                            <Box mt={4}>
                                <InputField name="email" label="UNIVERSITY EMAIL" placeholder="" autoComplete='new-password' />
                            </Box>
                            <Box mt={4}>
                                <InputField name="password" label="PASSWORD" placeholder="" type="password" autoComplete='new-password' />
                            </Box>
                            <Button mt={8} w="100%" type="submit" colorScheme="blue" isLoading={props.isSubmitting}>
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
