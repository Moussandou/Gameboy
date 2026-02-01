import React, { useState, useEffect, useRef } from 'react';
import { useSystem } from '../../domain/os/SystemContext';

export const SettingsApp: React.FC<{ input?: Set<string> }> = ({ input }) => {
    const { volume, brightness, setVolume, setBrightness } = useSystem();
    const [selectedRow, setSelectedRow] = useState(0);
    const prevInput = useRef<Set<string>>(new Set());

    // We need to hook into the input loop somehow. 
    // Ideally user inputs should be passed down, but for now we'll cheat a bit 
    // by assuming inputs are available via a hook or props. 
    // Since OSContainer passes input, we should accept it as props.
    // BUT, OSContainer mapping doesn't pass input to apps yet (except gameProps).
    // FIX: We need OSContainer to pass `input` to all apps.

    useEffect(() => {
        if (!input) return;

        const isJustPressed = (btn: string) => input.has(btn) && !prevInput.current.has(btn);

        if (isJustPressed('DOWN')) setSelectedRow(1);
        if (isJustPressed('UP')) setSelectedRow(0);

        if (selectedRow === 0) { // Volume
            if (isJustPressed('LEFT')) setVolume(volume - 1);
            if (isJustPressed('RIGHT')) setVolume(volume + 1);
        } else { // Brightness
            if (isJustPressed('LEFT')) setBrightness(brightness - 1);
            if (isJustPressed('RIGHT')) setBrightness(brightness + 1);
        }

        prevInput.current = new Set(input);
    }, [input, selectedRow, volume, brightness, setVolume, setBrightness]);

    return (
        <div className="w-full h-full bg-[#eeeeee] flex flex-col font-jersey text-gb-screen-darkest relative overflow-hidden">
            {/* Header */}
            <div className="h-10 bg-white border-b border-gray-300 flex items-center justify-center shadow-sm z-10">
                <span className="text-lg text-gray-600 font-bold tracking-widest bg-white z-10 px-4">SETTINGS</span>
                <div className="absolute inset-x-0 h-[1px] bg-gray-300 top-1/2 -z-0"></div>
            </div>

            <div className="flex-1 p-6 space-y-6 flex flex-col justify-center">

                {/* Volume Control */}
                <div className={`transition-all duration-200 p-4 rounded-xl border-2 ${selectedRow === 0 ? 'bg-white border-[#5acbf7] shadow-lg scale-105' : 'bg-transparent border-transparent opacity-80'}`}>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-500 font-bold">Volume</span>
                        <span className="text-blue-400 font-bold">{volume * 10}%</span>
                    </div>
                    <div className="flex gap-1 h-3">
                        {[...Array(10)].map((_, i) => (
                            <div
                                key={i}
                                className={`flex-1 rounded-sm transition-colors ${i < volume ? 'bg-blue-400' : 'bg-gray-200'}`}
                            ></div>
                        ))}
                    </div>
                </div>

                {/* Brightness Control */}
                <div className={`transition-all duration-200 p-4 rounded-xl border-2 ${selectedRow === 1 ? 'bg-white border-[#5acbf7] shadow-lg scale-105' : 'bg-transparent border-transparent opacity-80'}`}>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-500 font-bold">Brightness</span>
                        <span className="text-yellow-400 font-bold">{brightness * 10}%</span>
                    </div>
                    <div className="flex gap-1 h-3">
                        {[...Array(10)].map((_, i) => (
                            <div
                                key={i}
                                className={`flex-1 rounded-sm transition-colors ${i < brightness ? 'bg-yellow-400' : 'bg-gray-200'}`}
                            ></div>
                        ))}
                    </div>
                </div>

                {/* Hint */}
                <div className="mt-auto text-center text-[10px] text-gray-400 tracking-wider">
                    Use D-PAD to Adjust • B to Exit
                </div>
            </div>
        </div>
    );
};
