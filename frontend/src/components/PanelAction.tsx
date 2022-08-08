import { ActionIcon, ActionIconProps } from '@mantine/core';
import React from 'react';

type IActionIcon = ActionIconProps & React.ComponentPropsWithoutRef<'button'>;

interface IPanelAction extends IActionIcon {
    children?: any;
}

const PanelAction = ({ children, className, ...props }: IPanelAction) => {
    // const theme = useMantineTheme();
    return (
    // <Box w="51px" h="51px" marginBottom={!isBottom ? '20px' : '0'} borderRadius="30px" display="flex" justifyContent="center" alignItems="center" {...props}>
        <ActionIcon aria-label='Navigate' className={`${!props.color ? 'bg-_blue-700/[.2] hover:bg-_blue-800/[.25]' : ''} w-[51px] h-[51px] ${className ?? ''}`} radius='lg' color='blue' variant='light' {...props}>
            {children}
        </ActionIcon>
    );
};

export default PanelAction;