import React, { useState, useEffect, useRef } from 'react';
import { audioService } from '../../infra/AudioService';
import { SystemContext } from './SystemContext';

export const SystemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [volume, setVolumeState] = useState(5);
    const [brightness, setBrightness] = useState(10);
    const [musicEnabled, setMusicEnabled] = useState(true);
    const bgmRef = useRef<HTMLAudioElement | null>(null);

    // Initialize BGM
    useEffect(() => {
        const audio = new Audio('/audio/Wii Menu Music.mp3');
        audio.loop = true;
        audio.volume = 0.3; // Base volume for BGM
        bgmRef.current = audio;

        // Attempt autoplay (may be blocked by browser until user interaction)
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.catch(() => {
                // Autoplay blocked, will start on first user interaction
                const startAudio = () => {
                    audio.play();
                    document.removeEventListener('click', startAudio);
                    document.removeEventListener('touchstart', startAudio);
                };
                document.addEventListener('click', startAudio);
                document.addEventListener('touchstart', startAudio);
            });
        }

        return () => {
            audio.pause();
            audio.src = '';
        };
    }, []);

    // Sync BGM with musicEnabled and volume
    useEffect(() => {
        if (bgmRef.current) {
            if (musicEnabled) {
                bgmRef.current.volume = (volume / 10) * 0.3; // BGM at 30% of master
                bgmRef.current.play().catch(() => { });
            } else {
                bgmRef.current.pause();
            }
        }
    }, [musicEnabled, volume]);

    // Sync SFX volume with AudioService
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

    const toggleMusic = () => {
        setMusicEnabled(prev => !prev);
    };

    return (
        <SystemContext.Provider value={{ volume, brightness, musicEnabled, setVolume, setBrightness: setBrightnessVal, toggleMute, toggleMusic }}>
            <div style={{ filter: `brightness(${0.5 + (brightness / 20)})` }} className="w-full h-full transition-all duration-300">
                {children}
            </div>
        </SystemContext.Provider>
    );
};

