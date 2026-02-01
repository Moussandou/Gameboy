import React, { useState, useEffect, useRef } from 'react';
import { useSystem } from '../../domain/os/SystemContext';

export const SettingsApp: React.FC<{ input?: Set<string> }> = ({ input }) => {
    const { volume, brightness, musicEnabled, setVolume, setBrightness, toggleMusic } = useSystem();
    const [selectedRow, setSelectedRow] = useState(0);
    const prevInput = useRef<Set<string>>(new Set());

    const ROWS = 3; // Volume, Brightness, Music

    useEffect(() => {
        if (!input) return;

        const isJustPressed = (btn: string) => input.has(btn) && !prevInput.current.has(btn);

        if (isJustPressed('DOWN')) setSelectedRow(prev => Math.min(prev + 1, ROWS - 1));
        if (isJustPressed('UP')) setSelectedRow(prev => Math.max(prev - 1, 0));

        if (selectedRow === 0) { // Volume
            if (isJustPressed('LEFT')) setVolume(volume - 1);
            if (isJustPressed('RIGHT')) setVolume(volume + 1);
        } else if (selectedRow === 1) { // Brightness
            if (isJustPressed('LEFT')) setBrightness(brightness - 1);
            if (isJustPressed('RIGHT')) setBrightness(brightness + 1);
        } else if (selectedRow === 2) { // Music Toggle
            if (isJustPressed('A') || isJustPressed('LEFT') || isJustPressed('RIGHT')) {
                toggleMusic();
            }
        }

        prevInput.current = new Set(input);
    }, [input, selectedRow, volume, brightness, setVolume, setBrightness, toggleMusic]);

    return (
        <div className="w-full h-full bg-[#eeeeee] flex flex-col font-jersey text-gb-screen-darkest relative overflow-hidden">
            {/* Header */}
            <div className="h-10 bg-white border-b border-gray-300 flex items-center justify-center shadow-sm z-10">
                <span className="text-lg text-gray-600 font-bold tracking-widest bg-white z-10 px-4">SETTINGS</span>
                <div className="absolute inset-x-0 h-[1px] bg-gray-300 top-1/2 -z-0"></div>
            </div>

            <div className="flex-1 p-4 space-y-4 flex flex-col justify-center overflow-y-auto">

                {/* Volume Control */}
                <div className={`transition-all duration-200 p-3 rounded-xl border-2 ${selectedRow === 0 ? 'bg-white border-[#5acbf7] shadow-lg scale-105' : 'bg-transparent border-transparent opacity-80'}`}>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-500 font-bold text-sm">Volume</span>
                        <span className="text-blue-400 font-bold text-sm">{volume * 10}%</span>
                    </div>
                    <div className="flex gap-1 h-2">
                        {[...Array(10)].map((_, i) => (
                            <div
                                key={i}
                                className={`flex-1 rounded-sm transition-colors ${i < volume ? 'bg-blue-400' : 'bg-gray-200'}`}
                            ></div>
                        ))}
                    </div>
                </div>

                {/* Brightness Control */}
                <div className={`transition-all duration-200 p-3 rounded-xl border-2 ${selectedRow === 1 ? 'bg-white border-[#5acbf7] shadow-lg scale-105' : 'bg-transparent border-transparent opacity-80'}`}>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-500 font-bold text-sm">Brightness</span>
                        <span className="text-yellow-400 font-bold text-sm">{brightness * 10}%</span>
                    </div>
                    <div className="flex gap-1 h-2">
                        {[...Array(10)].map((_, i) => (
                            <div
                                key={i}
                                className={`flex-1 rounded-sm transition-colors ${i < brightness ? 'bg-yellow-400' : 'bg-gray-200'}`}
                            ></div>
                        ))}
                    </div>
                </div>

                {/* Music Toggle */}
                <div className={`transition-all duration-200 p-3 rounded-xl border-2 ${selectedRow === 2 ? 'bg-white border-[#5acbf7] shadow-lg scale-105' : 'bg-transparent border-transparent opacity-80'}`}>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-500 font-bold text-sm">Music</span>
                        <div className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${musicEnabled ? 'bg-green-400 text-white' : 'bg-gray-300 text-gray-500'}`}>
                            {musicEnabled ? 'ON' : 'OFF'}
                        </div>
                    </div>
                </div>

                {/* Hint */}
                <div className="mt-auto text-center text-[10px] text-gray-400 tracking-wider">
                    D-PAD to Adjust • A to Toggle • SELECT to Exit
                </div>
            </div>
        </div>
    );
};

