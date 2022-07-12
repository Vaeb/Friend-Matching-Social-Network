import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useMeQuery } from '../generated/graphql';

export const useCheckAuth = (needsAuth = true) => {
    const [{ data, fetching }] = useMeQuery();
    const router = useRouter();

    useEffect(() => {
        if (!needsAuth) {
            console.log('No auth needed...');
        } else if (!fetching && !data?.me) {
            console.log('Not logged in');
            router.push('/login');
        } else if (!fetching) {
            console.log('Is authorized', data?.me);
        }
    }, [needsAuth, fetching, data, router]);

    return data;
};
