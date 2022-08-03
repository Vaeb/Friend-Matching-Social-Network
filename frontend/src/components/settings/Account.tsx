import {
    ActionIcon,
    Avatar,
    Button, ColorInput, Group, Image, PasswordInput, Select, Stack, Text, TextInput, useMantineTheme, 
} from '@mantine/core';
import React, { FC, useRef, useState } from 'react';
import { DatePicker } from '@mantine/dates';
import { Dropzone, DropzoneProps, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { TbRefresh as IconRefresh } from 'react-icons/tb';
import { IoImageOutline as IconImage, IoCloudUploadOutline as IconUpload, IoRemoveCircleOutline as IconRemove } from 'react-icons/io5';
import Router from 'next/router';

import { UpdateMeMutationVariables, useGetUniversitiesQuery, useMeQuery, useSingleUploadMutation, useUpdateMeMutation } from '../../generated/graphql';
import { defaultAvatarUrl } from '../../defaults';
import { avatarUrl } from '../../utils/avatarUrl';

export const desc = 'Personalise your account';

const hslToHex = (h: number, s: number, l: number) => {
    console.log(h, s, l);
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = (n) => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
};

const Account: FC<any> = () => {
    const theme = useMantineTheme();
    const [universitiesQuery] = useGetUniversitiesQuery();
    const [, doSingleUpload] = useSingleUploadMutation();
    const [, doUpdateMe] = useUpdateMeMutation();
    const [{ data: meData, fetching: meFetching }] = useMeQuery();
    const universities = !universitiesQuery.fetching ? universitiesQuery?.data?.getUniversities : [];
    const me = !meFetching ? meData?.me : null;
    
    const nameRef = useRef<HTMLInputElement>(null);
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef1 = useRef<HTMLInputElement>(null);
    const passwordRef2 = useRef<HTMLInputElement>(null);
    const passwordRef3 = useRef<HTMLInputElement>(null);
    const [universityId, setUniversityId] = useState(me?.universityId ? String(me.universityId) : '');
    const [birthDate, setBirthDate] = useState(me?.birthDate ? new Date(me.birthDate) : null);
    const [colorValue, setColorValue] = useState(me?.color || theme.colors._gray[8]);
    const [{ file, fileUrl }, setFile] = useState({ file: null, fileUrl: null });

    const universityValues = universities.map(university => ({ value: String(university.id), label: university.name }));

    // const randomColor = () => `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    const randomColor1 = () => `hsl(${~~(360 * Math.random())}, 70%, 80%)`;
    const randomColor2 = () => `hsl(${~~(360 * Math.random())}, ${~~(25 + 70 * Math.random())}%, ${~~(85 + 10 * Math.random())}%)`;
    const randomColor2b = () => `hsl(${~~(360 * Math.random())}, ${~~(70 + 20 * Math.random())}%, ${~~(55 + (75 - 55) * Math.random())}%)`;
    const randomColor3 = () => {
        const hue = ~~(341 * Math.random());
        let saturation = 100;
        let lightness = 50;
        if (hue > 215 && hue < 265) {
            const gain = 20;
            const blueness = 1 - Math.abs(hue - 240) / 25;
            const change  = Math.floor(gain * blueness);
            saturation -= change;
            lightness += change;
        }
        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    };
    const randomColor = () => hslToHex(...randomColor2b().match(/\d+/g).map(n => Number(n)) as [number, number, number]);

    const onDropFiles = (files: File[]) => {
        console.log('accepted files', files);
        const newFile = files[0];
        const newFileUrl = URL.createObjectURL(newFile);
        setFile({ file: newFile, fileUrl: newFileUrl });
    };

    const saveUpdate = async (varName: keyof UpdateMeMutationVariables, inputRefs: any) => {
        const isRef = Array.isArray(inputRefs);
        const varValue = isRef ? inputRefs[0].current.value : inputRefs;
        console.log('Updating user...', isRef, varValue);
        let result;
        if (varName === 'password') {
            const oldPassword = inputRefs[0].current.value;
            const newPassword1 = inputRefs[1].current.value;
            const newPassword2 = inputRefs[2].current.value;
            if (newPassword1 !== newPassword2) {
                console.log('Passwords do not match');
                return;
            }
            result = await doUpdateMe({ oldPassword, password: newPassword1 });
        } else {
            result = await doUpdateMe({ [varName]: varValue });
        }
        if (result.data?.updateMe.ok) {
            if (isRef) {
                for (const ref of inputRefs) ref.current.value = '';
            }
            console.log('Update success');
        } else {
            console.log('Update failed:', result.data?.updateMe.errors);
        }
    };

    const saveAvatar = async () => {
        try {
            console.log('Uploading...');
            const result = await doSingleUpload({ file });
            Router.reload();
            console.log('Upload successfully:', result);
        } catch (err) {
            console.log('Upload failed:', err);
        }
    };

    return (
        <Stack spacing={16}>
            <Stack spacing={2}>
                <Text className='text-[14px] font-[500] text-_label'>Name</Text>
                <div className='flex gap-1'>
                    <TextInput ref={nameRef} classNames={{ root: 'grow' }} autoComplete='new-password' size='sm' variant='filled' placeholder={me?.name} />
                    <Button size='sm' variant='filled' color='grape' onClick={() => saveUpdate('name', [nameRef])}>Save</Button>
                </div>
            </Stack>
            <Stack spacing={2}>
                <Text className='text-[14px] font-[500] text-_label'>Username</Text>
                <div className='flex gap-1'>
                    <TextInput ref={usernameRef} classNames={{ root: 'grow' }} autoComplete='new-password' size='sm' variant='filled' placeholder={me?.username} />
                    <Button size='sm' variant='filled' color='grape' onClick={() => saveUpdate('username', [usernameRef])}>Save</Button>
                </div>
            </Stack>
            <Stack spacing={2}>
                <Text className='text-[14px] font-[500] text-_label'>Password</Text>
                <div className='flex gap-1'>
                    <PasswordInput ref={passwordRef1} classNames={{ root: 'grow' }} placeholder='Current password' autoComplete='new-password' variant='filled' />
                    <PasswordInput ref={passwordRef2} classNames={{ root: 'grow' }} placeholder='New password' autoComplete='new-password' variant='filled' />
                    <PasswordInput ref={passwordRef3} classNames={{ root: 'grow' }} placeholder='Confirm password' autoComplete='new-password' variant='filled' />
                    <Button size='sm' variant='filled' color='grape' onClick={() => saveUpdate('password', [passwordRef1, passwordRef2, passwordRef3])}>Save</Button>
                </div>
            </Stack>
            <Stack spacing={2}>
                <Text className='text-[14px] font-[500] text-_label'>University</Text>
                <div className='flex gap-1'>
                    <Select
                        variant='filled'
                        classNames={{ root: 'grow' }}
                        value={universityId}
                        onChange={setUniversityId}
                        placeholder='Choose a University'
                        searchable
                        nothingFound='No options'
                        data={universityValues}
                    />
                    <Button size='sm' variant='filled' color='grape' onClick={() => saveUpdate('universityId', Number(universityId))}>Save</Button>
                </div>
            </Stack>
            <Stack spacing={2}>
                <Text className='text-[14px] font-[500] text-_label'>Birth date</Text>
                <div className='flex gap-1'>
                    <DatePicker value={birthDate} onChange={setBirthDate} classNames={{ root: 'grow' }} variant='filled' />
                    <Button size='sm' variant='filled' color='grape' onClick={() => saveUpdate('birthDate', birthDate)}>Save</Button>
                </div>
            </Stack>
            <Stack spacing={2}>
                <Text className='text-[14px] font-[500] text-_label'>User colour</Text>
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
            <Stack spacing={2}>
                <Text className='text-[14px] font-[500] text-_label'>Avatar</Text>
                <div className='flex gap-[4px]'>
                    <Dropzone
                        onDrop={onDropFiles}
                        onReject={files => console.log('rejected files', files)}
                        maxSize={3 * 1024 ** 2}
                        // radius='md'
                        accept={{
                            'image/*': [], // All images
                        }}
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
