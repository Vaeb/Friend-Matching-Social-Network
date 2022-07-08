import { Icon } from '@chakra-ui/react';
import React, { FC } from 'react';
import { MdTimeline as IconHome } from 'react-icons/md';
import { FaUserFriends as IconMatches } from 'react-icons/fa';
// import NextLink from 'next/link';
import { useAppStore } from '../state';

import RoundBox from '../components/RoundBox';

const BaseRight: FC<any> = () => {
    const setView = useAppStore(state => state.setView);

    return (
        <>
            <RoundBox _hover={{ bg: 'rgba(79, 84, 92, 0.6)', cursor: 'pointer' }} onClick={() => setView('base')}>
                <Icon as={IconHome} w="60%" h="60%" color="#b9bbbe" />
            </RoundBox>
            <RoundBox _hover={{ bg: 'rgba(79, 84, 92, 0.6)', cursor: 'pointer' }} onClick={() => setView('base')}>
                <Icon as={IconMatches} w="60%" h="60%" color="#b9bbbe" />
            </RoundBox>
        </>
    );
};

export default BaseRight;
