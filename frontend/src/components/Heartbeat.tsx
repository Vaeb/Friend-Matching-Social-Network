import React from 'react';
import { useHeartbeatSubscription } from '../generated/graphql';

const Heartbeat = () => {
    const [heartbeatRes] = useHeartbeatSubscription();
    console.log('heartbeatRes', new Date(+heartbeatRes?.data?.heartbeat));

    return (<></>);
};

export default Heartbeat;