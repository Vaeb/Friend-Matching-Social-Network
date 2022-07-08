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

// hover bg rgba(79, 84, 92, 0.6)

interface PanelRProps {
    children?: React.ReactNode;
}

const PanelR: FC<PanelRProps> = ({ children }) => {
    const setView = useAppStore(state => state.setView);

    return (
        <Box borderLeft="1px solid rgba(0, 0, 0, 0.7)" h="100%" w="80px">
            <Box h="100%" display="flex" flexDirection="column" justifyContent="space-between" alignItems="center" paddingY="20px">
                <Box display="flex" flexDirection="column" alignItems="center">
                    {children ?? <BaseRight />}
                </Box>
                <Box>
                    <RoundBox isBottom _hover={{ bg: 'rgba(79, 84, 92, 0.6)', cursor: 'pointer' }} onClick={() => setView('settings')}>
                        <Icon as={IconSettings} w="70%" h="70%" color="#b9bbbe" />
                    </RoundBox>
                </Box>
            </Box>
        </Box>
    );
};

export default PanelR;
