import create from 'zustand';
import produce from 'immer';

type Panel = 'left' | 'mid' | 'right';

interface AppState {
    left: {
        view: string;
    };
    mid: {
        view: string;
    };
    right: {
        view: string;
    };
    setView: (view: string, panels?: Panel | Panel[]) => void;
}

export const useAppStore = create<AppState>(set => ({
    left: {
        view: 'base',
    },
    mid: {
        view: 'base',
    },
    right: {
        view: 'base',
    },
    settings: {
        section: 'account',
    },
    setView: (view, panels) =>
        set(produce((state) => {
            if (!panels) panels = ['left', 'mid', 'right'];
            if (typeof panels === 'string') panels = [panels];
            panels.forEach((panel) => {
                state[panel].view = view;
            });
        })),
}));

interface SettingsState {
    section: string;
    setSection: (section: string) => void;
}

export const useSettingsStore = create<SettingsState>(set => ({
    section: 'account',
    setSection: section =>
        set(produce((state) => {
            state.section = section;
        })),
}));