import React, { FC, InputHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { useField } from 'formik';
// import {
//     FormControl,
//     FormLabel,
//     Input,
//     FormErrorMessage,
//     Textarea,
// } from '@chakra-ui/react';

type GenericFieldProps = { label: string; } & (
    {
        elType: 'input';
        elProps: Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & { name: string };
    }
    | {
        elType: 'textarea';
        elProps: TextareaHTMLAttributes<HTMLTextAreaElement> & { name: string };
    });

const GenericField: FC<GenericFieldProps> = ({
    label,
    elType,
    elProps,
}) => {
    const [field, { error }] = useField(elProps);
    return (
        <FormControl isInvalid={!!error}>
            <FormLabel htmlFor={field.name}>{label}</FormLabel>
            {elType === 'input' ? <Input {...field} {...elProps} id={field.name} />
                : elType === 'textarea' ? <Textarea {...field} {...elProps} id={field.name} />
                    : null}
            {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
        </FormControl>
    );
};

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    name: string;
};

type TextFieldProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
    label: string;
    name: string;
};

export const InputField: FC<InputFieldProps> = ({
    label,
    size: _,
    ...elProps
}) => {
    return (
        <GenericField label={label} elType='input' elProps={elProps} />
    );
};

export const TextField: FC<TextFieldProps> = ({
    label,
    ...elProps
}) => {
    return (
        <GenericField label={label} elType='textarea' elProps={elProps} />
    );
};
