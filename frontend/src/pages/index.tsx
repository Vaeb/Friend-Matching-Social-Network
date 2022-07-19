import { Loader } from '@mantine/core';

import Page from '../components/Page';
import PanelR from '../components/PanelRight';
import PanelL from '../components/PanelLeft';
import PanelM from '../components/PanelMid';
import { useCheckAuth } from '../utils/useCheckAuth';

const Index = () => {
    const data = useCheckAuth();
    return (
        data?.me ? (
            <Page>
                <PanelL />
                <PanelM />
                <PanelR />
            </Page>
        ) : (
            <div className='flex items-center justify-center w-full h-full'>
                <Loader variant='oval' size='xl' />
            </div>
        )
    );
};

export default Index;
