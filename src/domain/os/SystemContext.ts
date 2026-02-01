import { createContext, useContext } from 'react';

export interface SystemState {
    volume: number; // 0 to 10
    brightness: number; // 0 to 10
    musicEnabled: boolean;
    toggleMute: () => void;
    setVolume: (vol: number) => void;
    setBrightness: (br: number) => void;
    toggleMusic: () => void;
}

export const SystemContext = createContext<SystemState>({
    volume: 5,
    brightness: 10,
    musicEnabled: true,
    toggleMute: () => { },
    setVolume: () => { },
    setBrightness: () => { },
    toggleMusic: () => { },
});

export const useSystem = () => useContext(SystemContext);
export type { SystemState as SystemStateType }; // To avoid confusion with the component
