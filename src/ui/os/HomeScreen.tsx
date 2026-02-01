import React, { useEffect, useRef } from 'react';
import type { AppConfig } from '../../domain/os/types';

interface HomeScreenProps {
    apps: AppConfig[];
    selectedIndex: number;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ apps, selectedIndex }) => {
    // Pad to ensure we always have full rows (multiple of 2)
    const paddedApps = [...apps];
    if (paddedApps.length % 2 !== 0) {
        paddedApps.push({ id: 'placeholder' as any, name: '', icon: '', component: () => null });
    }

    const containerRef = useRef<HTMLDivElement>(null);
    const selectedRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to keep selected item in view
    useEffect(() => {
        if (selectedRef.current && containerRef.current) {
            const container = containerRef.current;
            const element = selectedRef.current;

            const containerTop = container.scrollTop;
            const containerBottom = containerTop + container.clientHeight;
            const elemTop = element.offsetTop;
            const elemBottom = elemTop + element.clientHeight;

            // Scroll down if below view
            if (elemBottom > containerBottom) {
                container.scrollTo({ top: elemBottom - container.clientHeight, behavior: 'smooth' });
            }
            // Scroll up if above view
            else if (elemTop < containerTop) {
                container.scrollTo({ top: elemTop, behavior: 'smooth' });
            }
        }
    }, [selectedIndex]);

    return (
        <div className="w-full h-full bg-[#eee] flex flex-col font-jersey overflow-hidden">
            {/* Top Bar - Larger */}
            <div className="h-6 bg-gradient-to-b from-[#ddd] to-[#ccc] border-b border-white flex justify-center items-center shrink-0">
                <span className="text-gray-600 text-[10px] font-bold tracking-widest">MOUSSANDOU OS</span>
            </div>

            {/* Grid - Scrollable */}
            <div
                ref={containerRef}
                className="flex-1 p-2 overflow-y-auto no-scrollbar scroll-smooth"
            >
                <div className="grid grid-cols-2 gap-2 pb-2">
                    {paddedApps.map((app, index) => {
                        const isSelected = index === selectedIndex;
                        const isPlaceholder = (app.id as string) === 'placeholder';

                        return (
                            <div
                                key={index}
                                ref={isSelected ? selectedRef : null}
                                className={`aspect-square rounded-lg border-2 flex flex-col items-center justify-center relative transition-all duration-150 ${isSelected
                                    ? 'border-[#5acbf7] shadow-[0_0_8px_rgba(90,203,247,0.6)] bg-white z-10 scale-105'
                                    : 'border-gray-300 bg-[#f5f5f5] opacity-80 scale-100'
                                    }`}
                            >
                                <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent rounded-lg pointer-events-none"></div>

                                {!isPlaceholder ? (
                                    <>
                                        <div className="w-14 h-14 mb-1">
                                            {app.icon}
                                        </div>
                                        <div className="text-[10px] text-gray-800 font-bold uppercase text-center leading-tight px-1 break-words w-full">
                                            {app.name}
                                        </div>
                                    </>
                                ) : (
                                    <div className="opacity-20 text-2xl text-gray-400">?</div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Bottom Bar - Larger */}
            <div className="h-6 bg-white border-t border-gray-300 flex items-center justify-between px-3 text-[9px] text-gray-500 shrink-0 font-bold">
                <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></div>
                    <span>ONLINE</span>
                </div>
                <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
        </div>
    );
};


