import {
    ActionIcon,
    Avatar,
    Button, ColorInput, Group, Image, PasswordInput, Stack, Text, TextInput, useMantineTheme, 
} from '@mantine/core';
import React, { FC, useRef, useState } from 'react';
import { DatePicker } from '@mantine/dates';
import { Dropzone, DropzoneProps, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { TbRefresh as IconRefresh } from 'react-icons/tb';
import { IoImageOutline as IconImage, IoCloudUploadOutline as IconUpload, IoRemoveCircleOutline as IconRemove } from 'react-icons/io5';

import { UpdateMeMutationVariables, useMeQuery, useSingleUploadMutation, useUpdateMeMutation } from '../../generated/graphql';
import { defaultAvatarUrl } from '../../defaults';
import { avatarUrl } from '../../utils/avatarUrl';

export const desc = 'Personalise your account';

const Account: FC<any> = () => {
    const theme = useMantineTheme();
    const [, doSingleUpload] = useSingleUploadMutation();
    const [, doUpdateMe] = useUpdateMeMutation();
    const [{ data: meData, fetching: meFetching }] = useMeQuery();
    const me = !meFetching ? meData?.me : null;
    
    const nameRef = useRef<HTMLInputElement>(null);
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef1 = useRef<HTMLInputElement>(null);
    const passwordRef2 = useRef<HTMLInputElement>(null);
    const passwordRef3 = useRef<HTMLInputElement>(null);
    const [birthDate, setBirthDate] = useState(me.birthDate ? new Date(me.birthDate) : null);
    const [colorValue, setColorValue] = useState(me.color || theme.colors._gray[8]);
    const [{ file, fileUrl }, setFile] = useState({ file: null, fileUrl: null });

    const randomColor = () => `#${Math.floor(Math.random() * 16777215).toString(16)}`;

    const onDropFiles = (files: File[]) => {
        console.log('accepted files', files);
        const newFile = files[0];
        const newFileUrl = URL.createObjectURL(newFile);
        setFile({ file: newFile, fileUrl: newFileUrl });
    };

    const saveUpdate = async (varName: keyof UpdateMeMutationVariables, inputRefs: any) => {
        try {
            const isRef = Array.isArray(inputRefs);
            const varValue = isRef ? inputRefs[0].current.value : inputRefs;
            console.log('Updating user...', isRef, varValue);
            await doUpdateMe({ [varName]: varValue });
            if (isRef) {
                for (const ref of inputRefs) ref.current.value = '';
            }
            console.log('Update success');
        } catch (err) {
            console.log('Update failed:', err);
        }
    };

    const saveAvatar = async () => {
        try {
            console.log('Uploading...');
            const result = await doSingleUpload({ file });
            console.log('Upload successfully:', result);
        } catch (err) {
            console.log('Upload failed:', err);
        }
    };

    return (
        <Stack spacing={16}>
            <Stack spacing={5}>
                <Text size='md' weight='bold' color={theme.colors._gray[4]}>Name</Text>
                <div className='flex gap-1'>
                    <TextInput ref={nameRef} classNames={{ root: 'grow' }} autoComplete='new-password' size='sm' variant='filled' placeholder={me.name} />
                    <Button size='sm' variant='filled' color='grape' onClick={() => saveUpdate('name', [nameRef])}>Save</Button>
                </div>
            </Stack>
            <Stack spacing={5}>
                <Text size='md' weight='bold' color={theme.colors._gray[4]}>Username</Text>
                <div className='flex gap-1'>
                    <TextInput ref={usernameRef} classNames={{ root: 'grow' }} autoComplete='new-password' size='sm' variant='filled' placeholder={me.username} />
                    <Button size='sm' variant='filled' color='grape' onClick={() => saveUpdate('username', [usernameRef])}>Save</Button>
                </div>
            </Stack>
            <Stack spacing={5}>
                <Text size='md' weight='bold' color={theme.colors._gray[4]}>Password</Text>
                <div className='flex gap-1'>
                    <PasswordInput ref={passwordRef1} classNames={{ root: 'grow' }} placeholder='Current password' autoComplete='new-password' variant='filled' />
                    <PasswordInput ref={passwordRef2} classNames={{ root: 'grow' }} placeholder='New password' autoComplete='new-password' variant='filled' />
                    <PasswordInput ref={passwordRef3} classNames={{ root: 'grow' }} placeholder='Confirm password' autoComplete='new-password' variant='filled' />
                    <Button size='sm' variant='filled' color='grape' onClick={() => saveUpdate('password', [passwordRef2, passwordRef3, passwordRef1])}>Save</Button>
                </div>
            </Stack>
            <Stack spacing={5}>
                <Text size='md' weight='bold' color={theme.colors._gray[4]}>Birth date</Text>
                <div className='flex gap-1'>
                    <DatePicker value={birthDate} onChange={setBirthDate} classNames={{ root: 'grow' }} variant='filled' />
                    <Button size='sm' variant='filled' color='grape' onClick={() => saveUpdate('birthDate', birthDate)}>Save</Button>
                </div>
            </Stack>
            <Stack spacing={5}>
                <Text size='md' weight='bold' color={theme.colors._gray[4]}>User colour</Text>
                <div className='flex gap-1'>
                    <ColorInput
                        classNames={{ root: 'grow' }}
                        value={colorValue}
                        variant='filled'
                        onChange={setColorValue}
                        rightSection={
                            <ActionIcon onClick={() => setColorValue(randomColor())}>
                                <IconRefresh size={16} />
                            </ActionIcon>
                        }
                    />
                    <Button size='sm' variant='filled' color='grape' onClick={() => saveUpdate('color', colorValue)}>Save</Button>
                </div>
            </Stack>
            <Stack spacing={5}>
                <Text size='md' weight='bold' color={theme.colors._gray[4]}>Avatar</Text>
                <div className='flex gap-[4px]'>
                    <Dropzone
                        onDrop={onDropFiles}
                        onReject={files => console.log('rejected files', files)}
                        maxSize={3 * 1024 ** 2}
                        // radius='md'
                        accept={IMAGE_MIME_TYPE}
                        classNames={{ root: 'grow bg-[#2C2E33] h-[180px]' }}
                    >
                        <Group position='center' spacing='xl' style={{ minHeight: 180 - 36, pointerEvents: 'none' }}>
                            <Dropzone.Accept>
                                <IconUpload
                                    size={50}
                                    color={theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 4 : 6]}
                                />
                            </Dropzone.Accept>
                            <Dropzone.Reject>
                                <IconRemove
                                    size={50}
                                    color={theme.colors.red[theme.colorScheme === 'dark' ? 4 : 6]}
                                />
                            </Dropzone.Reject>
                            <Dropzone.Idle>
                                <IconImage size={50} />
                            </Dropzone.Idle>

                            <div>
                                <Text size='xl' inline>
                                    Drag image here or click to select file
                                </Text>
                                <Text size='sm' color='dimmed' inline mt={7}>
                                    Attach one file up to 5mb
                                </Text>
                            </div>
                        </Group>
                    </Dropzone>
                    <Stack spacing={4}>
                        <Avatar
                            radius='xl'
                            classNames={{ root: 'rounded-full w-[140px] h-[140px]' }} // 180-40
                            color='blue'
                            src={fileUrl || avatarUrl(me) || defaultAvatarUrl}
                            alt='Profile image'
                        />
                        <Button size='sm' variant='filled' color='grape' onClick={() => saveAvatar()}>Save</Button>
                    </Stack>
                </div>
            </Stack>
        </Stack>
    );
};

export default Account;
