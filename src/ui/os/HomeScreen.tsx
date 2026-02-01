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
            {/* Top Bar */}
            <div className="h-5 bg-gradient-to-b from-[#ddd] to-[#ccc] border-b border-white flex justify-center items-center shrink-0">
                <span className="text-gray-500 text-[10px] tracking-widest">MOUSSANDOU OS</span>
            </div>

            {/* Grid Container - fills space between bars */}
            <div className="flex-1 overflow-y-auto px-1.5 py-1.5">
                <div className="grid grid-cols-2 gap-1.5 w-full" style={{ gridAutoRows: 'calc((100cqh - 8px) / 2)' }}>
                    {paddedApps.map((app, index) => {
                        const isSelected = index === selectedIndex;
                        const isPlaceholder = (app.id as string) === 'placeholder';

                        return (
                            <div
                                key={index}
                                className={`rounded-md border-2 flex flex-col items-center justify-center relative transition-all duration-100 ${isSelected
                                    ? 'border-[#5acbf7] shadow-[0_0_6px_rgba(90,203,247,0.6)] bg-white'
                                    : 'border-gray-300 bg-[#f5f5f5] opacity-75'
                                    }`}
                            >
                                {/* Gloss */}
                                <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent rounded-md pointer-events-none"></div>

                                {!isPlaceholder ? (
                                    <>
                                        <div className={`w-10 h-10 mb-1 ${isSelected ? 'scale-105' : ''}`}>
                                            {app.icon}
                                        </div>
                                        <div className="text-[8px] text-gray-700 font-bold uppercase text-center leading-tight">
                                            {app.name}
                                        </div>
                                    </>
                                ) : (
                                    <div className="opacity-20 text-2xl font-bold text-gray-400">?</div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="h-6 bg-white border-t border-gray-300 flex items-center justify-between px-3 text-[9px] text-gray-500 shrink-0">
                <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></div>
                    <span>ONLINE</span>
                </div>
                <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
        </div>
    );
};

