import React, { createContext, useContext, useState, useEffect } from 'react';
import { audioService } from '../../infra/AudioService';

interface SystemState {
    volume: number; // 0 to 10
    brightness: number; // 0 to 10
    toggleMute: () => void;
    setVolume: (vol: number) => void;
    setBrightness: (br: number) => void;
}

const SystemContext = createContext<SystemState>({
    volume: 5,
    brightness: 10,
    toggleMute: () => { },
    setVolume: () => { },
    setBrightness: () => { },
});

export const useSystem = () => useContext(SystemContext);

export const SystemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [volume, setVolumeState] = useState(5);
    const [brightness, setBrightness] = useState(10);

    // Sync volume with AudioService
    useEffect(() => {
        audioService.setMasterVolume(volume / 10);
    }, [volume]);

    const setVolume = (vol: number) => {
        setVolumeState(Math.max(0, Math.min(10, vol)));
    };

    const setBrightnessVal = (br: number) => {
        setBrightness(Math.max(1, Math.min(10, br)));
    };

    const toggleMute = () => {
        setVolumeState(prev => (prev === 0 ? 5 : 0));
    };

    return (
        <SystemContext.Provider value={{ volume, brightness, setVolume, setBrightness: setBrightnessVal, toggleMute }}>
            <div style={{ filter: `brightness(${0.5 + (brightness / 20)})` }} className="w-full h-full transition-all duration-300">
                {children}
            </div>
        </SystemContext.Provider>
    );
};
