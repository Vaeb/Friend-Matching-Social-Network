import { Box } from '@chakra-ui/react';
import React, { FC } from 'react';

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
    return <Box h="100%" w="80px">{children}</Box>;
};

export default PanelR;
