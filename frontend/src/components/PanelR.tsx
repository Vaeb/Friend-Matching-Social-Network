import { Box, Icon } from '@chakra-ui/react';
import React, { FC } from 'react';
import { MdSettings as IconSettings } from 'react-icons/md';
// import NextLink from 'next/link';

import { useAppStore } from '../state';
import RoundBox from './RoundBox';
import BaseRight from '../panels/BaseRight';
// import { IconType } from 'react-icons/lib';

const ItemBoxShadow = `
    0 2.3px 3.6px #4f4f4f,
    0 .3px 10px rgba(0, 0, 0, 0.046),
    0 15.1px 24.1px rgba(0, 0, 0, 0.051),
    0 30px 40px rgba(0, 0, 0, 0.5)
`;

interface PanelRProps {
    children?: React.ReactNode;
}

const PanelR: FC<PanelRProps> = ({ children }) => {
    const setView = useAppStore(state => state.setView);

    return (
        <Box h='100%' w='80px' boxShadow='md'>
            <Box h='100%' display='flex' flexDirection='column' justifyContent='space-between' alignItems='center' paddingY='20px'>
                <Box display='flex' flexDirection='column' alignItems='center'>
                    {children ?? <BaseRight />}
                </Box>
                <Box>
                    <RoundBox isBottom _hover={{ bg: 'blackT5', cursor: 'pointer' }} onClick={() => setView('settings')}>
                        <Icon as={IconSettings} w='70%' h='70%' color='gray6' />
                    </RoundBox>
                </Box>
            </Box>
        </Box>
    );
};

export default PanelR;
