import { Icon } from '@chakra-ui/react';
import React, { FC } from 'react';
import { MdTimeline as IconHome } from 'react-icons/md';
import { FaUserFriends as IconMatches } from 'react-icons/fa';
import NextLink from 'next/link';

import RoundBox from '../components/RoundBox';

const RootRight: FC<any> = () => {
    return (
        <>
            <RoundBox _hover={{ bg: 'rgba(79, 84, 92, 0.6)' }}>
                <NextLink href="/">
                    <a style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon as={IconHome} w="60%" h="60%" color="#b9bbbe" />
                    </a>
                </NextLink>
            </RoundBox>
            <RoundBox _hover={{ bg: 'rgba(79, 84, 92, 0.6)' }}>
                <NextLink href="/">
                    <a style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon as={IconMatches} w="60%" h="60%" color="#b9bbbe" />
                    </a>
                </NextLink>
            </RoundBox>
        </>
    );
};

export default RootRight;
