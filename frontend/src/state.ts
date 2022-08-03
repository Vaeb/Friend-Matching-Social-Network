import create from 'zustand';
import { persist } from 'zustand/middleware';
import produce from 'immer';

import { GetUniversitiesQuery, Post, User } from './generated/graphql';

type Panel = 'left' | 'mid' | 'right';

interface ViewState {
    view: string;
    viewValue: any;
}

interface AppState {
    left: ViewState;
    mid: ViewState;
    right: ViewState;
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

export const useAppStore = create<AppState>()(persist((set, get) => ({
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
    setView: (view, panels, viewValue1, viewValue2, viewValue3, softViewValues = false) =>
        set(produce((state) => {
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
        })),
}), {
    name: 'fmsn-app-storage',
}));

interface ConvoState {
    messages: Record<string, any[]>;
    addMessage: (userId: string, message: any) => void;
}

export const useConvoStore = create<ConvoState>(set => ({
    messages: {},
    addMessage: (userId, message) =>
        set(produce((state) => {
            if (!state.messages[userId]) state.messages[userId] = [];
            state.messages[userId].push(message);
        })),
}));

type PostUser = Omit<Post, 'creator'> & { creator: Partial<User> };

interface TimelineState {
    scrollToTop: (() => void) | null;
    posts: PostUser[];
    refreshedPosts: Date;
    setScrollToTop: (scrollToTop: () => void) => void;
    setPosts: (posts: PostUser[]) => void;
}

export const useTimelineStore = create<TimelineState>(set => ({
    scrollToTop: null,
    posts: [],
    refreshedPosts: new Date(),
    setScrollToTop: scrollToTop =>
        set(produce((state) => {
            state.scrollToTop = scrollToTop;
        })),
    setPosts: posts =>
        set(produce((state) => {
            state.posts = posts;
            state.refreshedPosts = new Date();
        })),

}));

interface MiscState {
    resetClient: () => void;
    setSearchOpened: (React.Dispatch<React.SetStateAction<boolean>>) | null;
    universityMap: Record<string | number, GetUniversitiesQuery['getUniversities'][0]>;
    setResetClient: (resetClient: MiscState['resetClient']) => void;
    setSetSearchOpened: (setSearchOpened: MiscState['setSearchOpened']) => void;
    setUniversityMap: (universities: MiscState['universityMap']) => void;
}

export const useMiscStore = create<MiscState>(set => ({
    resetClient: null,
    setSearchOpened: null,
    universityMap: {},
    setResetClient: resetClient =>
        set(produce((state) => {
            state.resetClient = resetClient;
        })),
    setSetSearchOpened: setSearchOpened =>
        set(produce((state) => {
            state.setSearchOpened = setSearchOpened;
        })),
    setUniversityMap: universityMap =>
        set(produce((state) => {
            state.universityMap = universityMap;
        })),
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
