import React from 'react';
import type { AppConfig } from '../../domain/os/types';

interface HomeScreenProps {
    apps: AppConfig[];
    selectedIndex: number;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ apps, selectedIndex }) => {
    const paddedApps = [...apps];
    while (paddedApps.length < 4) {
        paddedApps.push({ id: 'placeholder' as any, name: '', icon: '', component: () => null });
    }

    return (
        <div className="w-full h-full bg-[#eee] flex flex-col font-jersey overflow-hidden">
            {/* Top Bar - fixed height */}
            <div className="h-[14px] bg-gradient-to-b from-[#ddd] to-[#ccc] border-b border-white flex justify-center items-center">
                <span className="text-gray-500 text-[8px] tracking-widest">MOUSSANDOU OS</span>
            </div>

            {/* Grid - takes remaining space */}
            <div className="flex-1 p-1 overflow-y-auto">
                <div className="grid grid-cols-2 grid-rows-2 gap-1 h-full">
                    {paddedApps.slice(0, 4).map((app, index) => {
                        const isSelected = index === selectedIndex;
                        const isPlaceholder = (app.id as string) === 'placeholder';

                        return (
                            <div
                                key={index}
                                className={`rounded border-2 flex flex-col items-center justify-center relative ${isSelected
                                    ? 'border-[#5acbf7] shadow-[0_0_4px_rgba(90,203,247,0.6)] bg-white'
                                    : 'border-gray-300 bg-[#f5f5f5] opacity-75'
                                    }`}
                            >
                                <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent rounded pointer-events-none"></div>

                                {!isPlaceholder ? (
                                    <>
                                        <div className="w-8 h-8 mb-0.5">
                                            {app.icon}
                                        </div>
                                        <div className="text-[6px] text-gray-700 font-bold uppercase text-center leading-none">
                                            {app.name}
                                        </div>
                                    </>
                                ) : (
                                    <div className="opacity-20 text-lg text-gray-400">?</div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Bottom Bar - fixed height */}
            <div className="h-[14px] bg-white border-t border-gray-300 flex items-center justify-between px-2 text-[7px] text-gray-500">
                <div className="flex items-center gap-0.5">
                    <div className="w-1 h-1 rounded-full bg-blue-400"></div>
                    <span>ONLINE</span>
                </div>
                <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
        </div>
    );
};


