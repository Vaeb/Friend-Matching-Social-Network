import { ActionIcon, ActionIconProps } from '@mantine/core';
import React from 'react';

type IActionIcon = ActionIconProps & React.ComponentPropsWithoutRef<'button'>;

interface IPanelAction extends IActionIcon {
    children?: any;
}

const PanelAction = ({ children, className, ...props }: IPanelAction) => {
    className = `w-[51px] h-[51px] ${className ?? ''}`;
    // const theme = useMantineTheme();
    return (
    // <Box w="51px" h="51px" marginBottom={!isBottom ? '20px' : '0'} borderRadius="30px" display="flex" justifyContent="center" alignItems="center" {...props}>
        <ActionIcon aria-label='Navigate' className={className} radius='lg' color='blue' variant='light' {...props}>
            {children}
        </ActionIcon>
    );
};

export default PanelAction;