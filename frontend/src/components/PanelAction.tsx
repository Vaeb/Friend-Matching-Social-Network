import { ActionIcon, ActionIconProps } from '@mantine/core';
import React, { FC } from 'react';

type IActionIcon = ActionIconProps & React.ComponentPropsWithoutRef<'button'>;

interface IPanelAction extends IActionIcon {
    children?: any;
}

const PanelAction = ({ children, ...props }: IPanelAction) => {
    // const theme = useMantineTheme();
    return (
    // <Box w="51px" h="51px" marginBottom={!isBottom ? '20px' : '0'} borderRadius="30px" display="flex" justifyContent="center" alignItems="center" {...props}>
        <ActionIcon sx={{ width: '51px', height: '51px' }} radius='lg' color='blue' variant='light' {...props}>
            {children}
        </ActionIcon>
    );
};

export default PanelAction;