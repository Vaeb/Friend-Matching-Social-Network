import React from 'react';
import { Formik, Form, Field } from 'formik';
import { Button, FormControl, FormErrorMessage, FormLabel, Input } from '@chakra-ui/react';
import { InputField } from '../components/InputField';

interface RegisterProps {}

const Register: React.FC<RegisterProps> = ({}) => {
    const validateUsername = (value: string) => value && value.length > 3 ? undefined : 'Username must be at least 3 characters';

    return (
        <Formik
            initialValues={{ username: '', email: '', password: '' }}
            onSubmit={(values, actions) => {
                console.log(values);
                // actions.setSubmitting(false);
            }}
        >
            {props => (
                <Form>
                    <InputField name="username" label="Username" placeholder="Username" />
                    <Button mt={4} type="submit" colorScheme="teal" isLoading={props.isSubmitting}>
                        Submit
                    </Button>
                </Form>
            )}
        </Formik>
    );
};

export default Register;
