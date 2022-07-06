import { Box } from '@chakra-ui/react';
import React, { FC } from 'react';

interface PanelMProps {
    children?: React.ReactNode;
}

const PanelM: FC<PanelMProps> = ({ children }) => { // #36393f
    return <Box h="100%" flex="1 1 auto" bg="#3c404b" px={10} py={3}>{children}</Box>;
};

export default PanelM;
