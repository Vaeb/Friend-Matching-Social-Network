import { Loader } from '@mantine/core';

import Page from '../components/Page';
import PanelR from '../components/PanelR';
import PanelL from '../components/PanelL';
import PanelM from '../components/PanelM';
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
