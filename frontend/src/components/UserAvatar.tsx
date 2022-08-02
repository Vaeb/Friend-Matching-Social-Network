import { Avatar } from '@mantine/core';
import React from 'react';
import { defaultAvatarUrl } from '../defaults';

const UserAvatar = ({ url, className, ...props }) => {
    return (
        <Avatar
            radius='xl'
            classNames={{ root: className }}
            src={url || defaultAvatarUrl}
            alt='User avatar'
            {...props}
        />
    );
};

export default UserAvatar;