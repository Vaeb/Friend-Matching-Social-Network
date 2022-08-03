import { useEffect } from 'react';
import { Loader } from '@mantine/core';

import Page from '../components/Page';
import PanelR from '../components/PanelRight';
import PanelL from '../components/PanelLeft';
import PanelM from '../components/PanelMid';
import { useCheckAuth } from '../utils/useCheckAuth';
import { useGetUniversitiesQuery } from '../generated/graphql';
import { useMiscStore } from '../state';

const Index = () => {
    const data = useCheckAuth();
    const [universitiesQuery] = useGetUniversitiesQuery();
    const universities = !universitiesQuery.fetching ? universitiesQuery?.data?.getUniversities : null;

    const setUniversityMap = useMiscStore(state => state.setUniversityMap);

    useEffect(() => {
        if (universities != null) {
            console.log('Set universities!');
            const universityMap = Object.assign({}, ...universities.map(university => ({ [university.id]: university })));
            setUniversityMap(universityMap);
        }
    }, [universities, setUniversityMap]);

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
