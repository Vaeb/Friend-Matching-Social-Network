import { Box, Flex } from '@chakra-ui/react';

import Page from '../components/Page';
import PanelL from '../components/PanelL';
import PanelM from '../components/PanelM';
import PanelR from '../components/PanelR';

const Index = () => (
    <Page>
        <Flex w="100%" h="100%">
            <PanelL />
            <PanelM />
            <PanelR />
        </Flex>
    </Page>
);

export default Index;
