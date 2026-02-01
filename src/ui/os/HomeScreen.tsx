import React from 'react';
import type { AppConfig } from '../../domain/os/types';

interface HomeScreenProps {
    apps: AppConfig[];
    selectedIndex: number;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ apps, selectedIndex }) => {
    // Pad the apps to fill the grid (min 4 slots)
    const paddedApps = [...apps];
    while (paddedApps.length < 4) {
        paddedApps.push({ id: 'placeholder' as any, name: '', icon: '', component: () => null });
    }

    return (
        <div className="w-full h-full bg-[#eeeeee] flex flex-col font-jersey text-gb-screen-darkest overflow-hidden relative">
            {/* Wii-like Top Bar */}
            <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-[#dddddd] to-[#cccccc] border-b border-white flex justify-center items-center shadow-sm z-10">
                <span className="text-gray-500 text-xs tracking-widest">MOUSSANDOU OS</span>
            </div>

            {/* Scrollable Grid Layout */}
            <div className="flex-1 pt-7 pb-1 px-2 overflow-y-auto">
                <div className="grid grid-cols-2 gap-1.5 w-full">
                    {paddedApps.map((app, index) => {
                        const isSelected = index === selectedIndex;
                        const isPlaceholder = (app.id as string) === 'placeholder';

                        return (
                            <div
                                key={index}
                                className={`aspect-square rounded-lg border-2 flex flex-col items-center justify-center relative transition-all duration-150 ${isSelected
                                    ? 'border-[#5acbf7] shadow-[0_0_8px_rgba(90,203,247,0.5)] bg-white z-10'
                                    : 'border-gray-300 bg-[#f9f9f9] shadow-inner opacity-80'
                                    }`}
                            >
                                {/* Gloss Effect */}
                                <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-transparent rounded-lg pointer-events-none"></div>

                                {!isPlaceholder ? (
                                    <>
                                        <div className={`w-7 h-7 mb-1 ${isSelected ? 'scale-110' : ''}`}>
                                            {app.icon}
                                        </div>
                                        <div className="text-[6px] text-gray-600 font-bold uppercase text-center px-0.5 truncate w-full leading-tight">
                                            {app.name}
                                        </div>
                                    </>
                                ) : (
                                    <div className="opacity-10 text-base font-bold text-gray-400">?</div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Bottom Bar (Wii U style) */}
            <div className="h-8 bg-white border-t border-gray-300 flex items-center justify-between px-4 text-[10px] text-gray-500">
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
                    <span>ONLINE</span>
                </div>
                <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
        </div>
    );
};
