import {
    ActionIcon,
    Avatar,
    Button, ColorInput, Group, Image, PasswordInput, Stack, Text, TextInput, useMantineTheme, 
} from '@mantine/core';
import React, { FC, useState } from 'react';
import { DatePicker } from '@mantine/dates';
import { Dropzone, DropzoneProps, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { TbRefresh as IconRefresh } from 'react-icons/tb';
import { IoImageOutline as IconImage, IoCloudUploadOutline as IconUpload, IoRemoveCircleOutline as IconRemove } from 'react-icons/io5';

import { useMeQuery } from '../../generated/graphql';
import { defaultAvatarUrl } from '../../defaults';

export const desc = 'Personalise your account';

const Account: FC<any> = () => {
    const theme = useMantineTheme();
    const [colorValue, setColorValue] = useState('#ffffff');

    const [{ data: meData, fetching: meFetching }] = useMeQuery();
    const me = !meFetching ? meData?.me : null;

    const randomColor = () => `#${Math.floor(Math.random() * 16777215).toString(16)}`;

    return (
        <Stack spacing={16}>
            <Stack spacing={5}>
                <Text size='md' weight='bold' color={theme.colors._gray[4]}>Name</Text>
                <div className='flex gap-1'>
                    <TextInput classNames={{ root: 'grow' }} autoComplete='new-password' size='sm' variant='filled' placeholder={me.name} />
                    <Button size='sm' variant='filled' color='grape'>Save</Button>
                </div>
            </Stack>
            <Stack spacing={5}>
                <Text size='md' weight='bold' color={theme.colors._gray[4]}>Username</Text>
                <div className='flex gap-1'>
                    <TextInput classNames={{ root: 'grow' }} autoComplete='new-password' size='sm' variant='filled' placeholder={me.username} />
                    <Button size='sm' variant='filled' color='grape'>Save</Button>
                </div>
            </Stack>
            <Stack spacing={5}>
                <Text size='md' weight='bold' color={theme.colors._gray[4]}>Password</Text>
                <div className='flex gap-1'>
                    <PasswordInput classNames={{ root: 'grow' }} placeholder='Current password' autoComplete='new-password' variant='filled' />
                    <PasswordInput classNames={{ root: 'grow' }} placeholder='New password' autoComplete='new-password' variant='filled' />
                    <PasswordInput classNames={{ root: 'grow' }} placeholder='Confirm password' autoComplete='new-password' variant='filled' />
                    <Button size='sm' variant='filled' color='grape'>Save</Button>
                </div>
            </Stack>
            <Stack spacing={5}>
                <Text size='md' weight='bold' color={theme.colors._gray[4]}>Birth date</Text>
                <div className='flex gap-1'>
                    <DatePicker classNames={{ root: 'grow' }} variant='filled' />
                    <Button size='sm' variant='filled' color='grape'>Save</Button>
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
                    <Button size='sm' variant='filled' color='grape'>Save</Button>
                </div>
            </Stack>
            <Stack spacing={5}>
                <Text size='md' weight='bold' color={theme.colors._gray[4]}>Avatar</Text>
                <div className='flex gap-1'>
                    <Dropzone
                        onDrop={files => console.log('accepted files', files)}
                        onReject={files => console.log('rejected files', files)}
                        maxSize={3 * 1024 ** 2}
                        // radius='md'
                        accept={IMAGE_MIME_TYPE}
                        classNames={{ root: 'grow bg-[#2C2E33]' }}
                    >
                        <Group position='center' spacing='xl' style={{ minHeight: 220, pointerEvents: 'none' }}>
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
                                    Drag images here or click to select files
                                </Text>
                                <Text size='sm' color='dimmed' inline mt={7}>
                                    Attach as many files as you like, each file should not exceed 5mb
                                </Text>
                            </div>
                        </Group>
                    </Dropzone>
                    <Stack spacing={4}>
                        <Avatar
                            radius='xl'
                            classNames={{ root: 'w-52 h-52 rounded-full' }}
                            color='blue'
                            src={me.avatarUrl || defaultAvatarUrl}
                            alt='Profile image'
                        >ML</Avatar>
                        <Button size='sm' variant='filled' color='grape'>Save</Button>
                    </Stack>
                </div>
            </Stack>
        </Stack>
    );
};

export default Account;
