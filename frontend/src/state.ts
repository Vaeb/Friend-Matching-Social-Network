import create from 'zustand';
import { persist } from 'zustand/middleware';
import produce from 'immer';

import { GetMessagesQuery, GetPostsWeightedQuery, GetUniversitiesQuery, Post, User } from './generated/graphql';
import { splitPosts, SplitPosts } from './utils/splitPosts';

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
        viewValue: null,
    },
    mid: {
        base: 'timeline',
        viewValue: null,
    },
    right: {
        base: 'base',
        viewValue: null,
    },
};

export const useAppStore = create<AppState>()(persist((set, get) => ({
    left: {
        view: translateViews.left.base,
        viewValue: translateViews.left.viewValue,
    },
    mid: {
        view: translateViews.mid.base,
        viewValue: translateViews.mid.viewValue,
    },
    right: {
        view: translateViews.right.base,
        viewValue: translateViews.right.viewValue,
    },
    setView: (view, panels, viewValue1, viewValue2, viewValue3, softViewValues = false) =>
        set(produce((state: AppState) => {
            if (!panels) panels = ['left', 'mid'];
            else if (panels === 'all') panels = ['left', 'mid', 'right'];
            else if (typeof panels === 'string') panels = [panels];

            if (view !== undefined && state.right.view === 'settings' && panels.includes('right')) {
                if (!panels.includes('left')) state.left.view = 'base';
                if (!panels.includes('mid')) state.mid.view = 'base';
            }

            if (view === 'settings' && viewValue1 === undefined) viewValue1 = 'account';
            // if (['timeline', 'base'].includes(view) && viewValue1 === undefined) viewValue1 = 'public';

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
        set(produce((state: ConvoState) => {
            if (!state.messages[userId]) state.messages[userId] = [];
            state.messages[userId].push(message);
        })),
}));

// type PostUser = Omit<Post, 'author'> & { author: Partial<User> };
type FullPost = GetPostsWeightedQuery['getPostsWeighted']['posts'][0];

export interface TimelineState {
    scrollToTop: (() => void) | null;
    room: 'public' | 'student';
    posts: FullPost[];
    postGroups: SplitPosts;
    refreshedPosts: Date;
    setScrollToTop: (scrollToTop: () => void) => void;
    setRoom: (room: TimelineState['room']) => void;
    setPosts: (posts: FullPost[]) => void;
}

export const useTimelineStore = create<TimelineState>(set => ({
    scrollToTop: null,
    room: 'public',
    posts: [],
    postGroups: { pPosts: [], sPosts: [] },
    refreshedPosts: new Date(),
    setRoom: room =>
        set(produce((state: TimelineState) => {
            state.room = room;
        })),
    setScrollToTop: scrollToTop =>
        set(produce((state: TimelineState) => {
            state.scrollToTop = scrollToTop;
        })),
    setPosts: posts =>
        set(produce((state: TimelineState) => {
            state.posts = posts;
            state.postGroups = splitPosts(posts);
            state.refreshedPosts = new Date();
        })),

}));

type FullMessage = GetMessagesQuery['getMessages']['messages'][0];

export interface ChatState {
    messages: Record<string | number, FullMessage[]>;
    // refreshedMessages: Record<string | number, Date>;
    refreshedMessages: Date;
    setMessages: (userId: number, messages: FullMessage[]) => void;
    // setRefreshed: (userId: number) => void;
    setRefreshed: () => void;
}

export const useChatStore = create<ChatState>(set => ({
    messages: {},
    refreshedMessages: new Date(),
    setMessages: (userId, _messages) =>
        set(produce((state: ChatState) => {
            // state.messages[userId] = messages;
            console.log('Refreshed messages date');
            state.refreshedMessages[userId] = new Date();
        })),
    setRefreshed: () =>
        set(produce((state: ChatState) => {
            console.log('Refreshed messages date (only)');
            // state.refreshedMessages[userId] = new Date();
            state.refreshedMessages = new Date();
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
        set(produce((state: MiscState) => {
            state.resetClient = resetClient;
        })),
    setSetSearchOpened: setSearchOpened =>
        set(produce((state: MiscState) => {
            state.setSearchOpened = setSearchOpened;
        })),
    setUniversityMap: universityMap =>
        set(produce((state: MiscState) => {
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
