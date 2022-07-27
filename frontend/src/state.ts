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
    setSearchOpened: (React.Dispatch<React.SetStateAction<boolean>>) | null;
    setSetSearchOpened: (setSearchOpened: React.Dispatch<React.SetStateAction<boolean>>) => void;
    setView: (view: string, panels?: Panel | Panel[] | 'all', viewValue1?: any, viewValue2?: any, viewValue3?: any, softViewValues?: boolean) => void;
}

const translateViews = {
    left : {
        base: 'timeline',
    },
    mid: {
        base: 'timeline',
    },
    right: {
        base: 'base',
    },
};

export const useAppStore = create<AppState>(set => ({
    left: {
        view: translateViews.left.base,
        viewValue: null,
    },
    mid: {
        view: translateViews.mid.base,
        viewValue: null,
    },
    right: {
        view: translateViews.right.base,
        viewValue: null,
    },
    setSearchOpened: null,
    setSetSearchOpened: setSearchOpened =>
        set(
            produce((state) => {
                state.setSearchOpened = setSearchOpened;
            })
        ),
    setView: (view, panels, viewValue1, viewValue2, viewValue3, softViewValues = false) =>
        set(
            produce((state) => {
                if (!panels) panels = ['left', 'mid'];
                else if (panels === 'all') panels = ['left', 'mid', 'right'];
                else if (typeof panels === 'string') panels = [panels];

                if (view !== undefined && state.right.view === 'settings' && panels.includes('right')) {
                    if (!panels.includes('left')) state.left.view = 'base';
                    if (!panels.includes('mid')) state.mid.view = 'base';
                }

                if (view === 'settings' && viewValue1 === undefined) viewValue1 = 'account';

                if (softViewValues === false) {
                    if (viewValue1 === undefined) viewValue1 = null; 
                    if (viewValue2 === undefined) viewValue2 = viewValue1;
                    if (viewValue3 === undefined) viewValue3 = viewValue2;
                }
                const viewValues = [viewValue1, viewValue2, viewValue3]; // Could be right, left

                panels.forEach((panel, i) => {
                    if (view !== undefined) state[panel].view = translateViews[panel][view] ?? view;
                    if (softViewValues === false || viewValues[i] !== undefined) state[panel].viewValue = viewValues[i];
                });
            })
        ),
}));

// interface SettingsState {
//     section: string;
//     setSection: (section: string) => void;
// }

// export const useSettingsStore = create<SettingsState>(set => ({
//     section: 'account',
//     setSection: section =>
//         set(
//             produce((state) => {
//                 state.section = section;
//             })
//         ),
// }));

// interface UserDataState {
//     me: MeQuery['me'];
//     matches: Match[];
// }

// export const useUserStore = create<UserDataState>(set => ({
//     me: null,
//     matches: [],
//     setMe: me =>
//         set(
//             produce((state) => {
//                 state.me = me;
//             })
//         ),
//     setMatches: matches =>
//         set(
//             produce((state) => {
//                 state.matches = matches;
//             })
//         ),
// }));

interface ConvoState {
    messages: Record<string, any[]>;
    addMessage: (userId: string, message: any) => void;
}

export const useConvoStore = create<ConvoState>(set => ({
    messages: {},
    addMessage: (userId, message) =>
        set(
            produce((state) => {
                if (!state.messages[userId]) state.messages[userId] = [];
                state.messages[userId].push(message);
            })
        ),
}));

interface TimelineState {
    scrollToTop: (() => void) | null;
    setScrollToTop: (scrollToTop: () => void) => void;
}

export const useTimelineStore = create<TimelineState>(set => ({
    scrollToTop: null,
    setScrollToTop: scrollToTop =>
        set(
            produce((state) => {
                state.scrollToTop = scrollToTop;
            })
        ),
}));
