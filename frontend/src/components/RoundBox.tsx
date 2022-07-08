import { Box, ChakraComponent } from '@chakra-ui/react';
import React, { FC } from 'react';

const RoundBox: ChakraComponent<'div', { isBottom?: boolean }> = ({ children, isBottom, ...props }) => (
    <Box w="51px" h="51px" marginBottom={!isBottom ? '20px' : '0'} borderRadius="30px" display="flex" justifyContent="center" alignItems="center" {...props}>
        {children}
    </Box>
);

export default RoundBox;
