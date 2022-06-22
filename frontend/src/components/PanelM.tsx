import { Box } from '@chakra-ui/react';
import React, { FC } from 'react';

interface PanelMProps {
    children?: React.ReactNode;
}

const PanelM: FC<PanelMProps> = ({ children }) => { // #36393f
    return <Box h="100%" flex="1 1 auto" bg="#3c404b">{children}</Box>;
};

export default PanelM;
