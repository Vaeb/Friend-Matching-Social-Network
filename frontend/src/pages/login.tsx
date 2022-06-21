import React from 'react';
import { Formik, Form } from 'formik';
import { Box, Button, Text } from '@chakra-ui/react';
import NextLink from 'next/link';

import { InputField } from '../components/InputField';
import Page from '../components/Page';

const ItemBoxShadow = `
    0 2.3px 3.6px #4f4f4f,
    0 .3px 10px rgba(0, 0, 0, 0.046),
    0 15.1px 24.1px rgba(0, 0, 0, 0.051),
    0 30px 40px rgba(0, 0, 0, 0.5)
`;

interface LoginProps {}

const Login: React.FC<LoginProps> = ({}) => {

    return (
        <Page type='center'>
            <Box bg="rgba(79,84,92,.6)" p="30px" minW="21vw" borderRadius="5px" boxShadow={ItemBoxShadow}>
                <Box fontSize="xl" fontWeight="semibold" mb={4}>
                    <Text>Welcome back!</Text>
                    {/* <Text>Please login.</Text> */}
                    <Box mt={1} fontSize="sm" fontWeight="medium" color="#00aff4">
                        <NextLink href="/register">
                            <a>
                                If you&apos;re new, create an account.
                            </a>
                        </NextLink>
                    </Box>
                </Box>
                <Formik
                    initialValues={{ username: '', email: '', password: '' }}
                    onSubmit={(values, actions) => {
                        console.log(values);
                        // actions.setSubmitting(false);
                    }}
                >
                    {props => (
                        <Form>
                            <Box>
                                <InputField name="handle" label="USERNAME OR EMAIL" placeholder="" />
                            </Box>
                            <Box mt={4}>
                                <InputField name="password" label="PASSWORD" placeholder="" type="password" />
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

export default Login;
