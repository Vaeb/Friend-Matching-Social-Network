import React from 'react';

import Page from '../components/Page';
import PanelL from '../components/PanelL';
import PanelM from '../components/PanelM';
import PanelR from '../components/PanelR';
import { useMeQuery } from '../generated/graphql';
import SettingsLeft from '../panels/SettingsLeft';
import SettingsMid from '../panels/SettingsMid';

const SettingGroupContext = React.createContext({ settingGroup: 'account', setSettingGroup: (group: string) => {} });

const Index = () => {
    const [settingGroup, setSettingGroup] = React.useState('account');
    const [{ data, fetching: _ }] = useMeQuery();
    const settingGroupValues = { settingGroup, setSettingGroup };
    return (
        <Page>
            <SettingGroupContext.Provider value={settingGroupValues}>
                <PanelL>
                    <SettingsLeft SettingGroupContext={SettingGroupContext} />
                </PanelL>
                <PanelM>
                    <SettingsMid SettingGroupContext={SettingGroupContext} data={data} />
                </PanelM>
                <PanelR />
            </SettingGroupContext.Provider>
        </Page>
    );
};

export default Index;
