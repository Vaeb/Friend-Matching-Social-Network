import { Box } from '@chakra-ui/react';
import React, { FC } from 'react';

import { useMeQuery } from '../generated/graphql';
import { useAppStore } from '../state';
import SettingsMid from '../panels/SettingsMid';

interface PanelMProps {
    children?: React.ReactNode;
}

const PanelM: FC<PanelMProps> = () => { // #36393f
    const [{ data, fetching: _ }] = useMeQuery();
    const view = useAppStore(state => state.left.view);

    return (
        <Box h="100%" flex="1 1 auto" bg="#3c404b" px={10} py={3}>
            {{
                settings: <SettingsMid data={data} />,
            }[view]}
        </Box>
    );
};

export default PanelM;
