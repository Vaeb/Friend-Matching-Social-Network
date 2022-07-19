import create from 'zustand';
import produce from 'immer';

import { GetMatchesDocument, Match, MeDocument, MeQuery } from './generated/graphql';

type Panel = 'left' | 'mid' | 'right';

interface ViewState {
    view: string;
    viewValue: any;
}

interface AppState {
    left: ViewState;
    mid: ViewState;
    right: ViewState;
    setView: (view: string, panels?: Panel | Panel[] | 'all', viewValue1?: any, viewValue2?: any, viewValue3?: any) => void;
}

export const useAppStore = create<AppState>(set => ({
    left: {
        view: 'base',
        viewValue: null,
    },
    mid: {
        view: 'base',
        viewValue: null,
    },
    right: {
        view: 'base',
        viewValue: null,
    },
    settings: {
        section: 'account',
    },
    setView: (view, panels, viewValue1, viewValue2, viewValue3) =>
        set(
            produce((state) => {
                if (!panels) panels = ['left', 'mid'];
                else if (panels === 'all') panels = ['left', 'mid', 'right'];
                else if (typeof panels === 'string') panels = [panels];
                if (viewValue1 === undefined) viewValue1 = null; 
                if (viewValue2 === undefined) viewValue2 = viewValue1;
                if (viewValue3 === undefined) viewValue3 = viewValue2;
                const viewValues = [viewValue1, viewValue2, viewValue3]; // Could be right, left
                panels.forEach((panel, i) => {
                    state[panel].view = view;
                    state[panel].viewValue = viewValues[i];
                });
            })
        ),
}));

interface SettingsState {
    section: string;
    setSection: (section: string) => void;
}

export const useSettingsStore = create<SettingsState>(set => ({
    section: 'account',
    setSection: section =>
        set(
            produce((state) => {
                state.section = section;
            })
        ),
}));

interface UserDataState {
    me: MeQuery['me'];
    matches: Match[];
}

export const useUserStore = create<UserDataState>(set => ({
    me: null,
    matches: [],
    setMe: me =>
        set(
            produce((state) => {
                state.me = me;
            })
        ),
    setMatches: matches =>
        set(
            produce((state) => {
                state.matches = matches;
            })
        ),
}));
