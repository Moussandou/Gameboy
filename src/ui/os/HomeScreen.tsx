import React, { useEffect, useRef } from 'react';
import { BackgroundManager } from './BackgroundManager';
import { useSystem } from '../../domain/os/SystemContext';
import type { AppDefinition } from '../../domain/os/appRegistry';
import type { AppId } from '../../domain/os/types';

interface HomeScreenProps {
    apps: AppDefinition[];
    selectedIndex: number;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ apps, selectedIndex }) => {
    const { theme } = useSystem();
    const isDark = theme === 'dark';

    const paddedApps = [...apps];
    if (paddedApps.length % 2 !== 0) {
        paddedApps.push({ id: 'placeholder' as AppId, name: '', icon: '', component: () => null });
    }

    const containerRef = useRef<HTMLDivElement>(null);
    const selectedRef = useRef<HTMLDivElement>(null);

    // Auto-scroll logic...
    useEffect(() => {
        if (selectedRef.current && containerRef.current) {
            const container = containerRef.current;
            const element = selectedRef.current;
            const containerTop = container.scrollTop;
            const containerBottom = containerTop + container.clientHeight;
            const elemTop = element.offsetTop;
            const elemBottom = elemTop + element.clientHeight;
            const PADDING_OFFSET = 8;

            if (elemBottom > containerBottom) {
                container.scrollTo({ top: elemBottom - container.clientHeight + PADDING_OFFSET, behavior: 'smooth' });
            } else if (elemTop < containerTop + PADDING_OFFSET) {
                container.scrollTo({ top: elemTop - PADDING_OFFSET, behavior: 'smooth' });
            }
        }
    }, [selectedIndex]);

    const baseBg = isDark ? 'bg-[#111]' : 'bg-white';
    const topBarBg = isDark ? 'bg-gradient-to-b from-[#333] to-[#222]' : 'bg-gradient-to-b from-[#ddd] to-[#ccc]';
    const topBarBorder = isDark ? 'border-[#444]' : 'border-white';
    const bottomBarBg = isDark ? 'bg-[#222] border-[#333]' : 'bg-white border-gray-300';
    const itemNormal = isDark ? 'bg-[#222] border-[#333] shadow-[0_2px_0_#111]' : 'bg-[#f0f0f0] border-2 border-gray-300 shadow-[0_2px_0_#ccc]';
    const itemSelected = isDark ? 'bg-[#333] border-[#5acbf7] shadow-[0_4px_0_#005f7a,0_8px_16px_rgba(0,0,0,0.5)]' : 'bg-white border-4 border-[#5acbf7] shadow-[0_4px_0_#3aa0c5,0_8px_16px_rgba(0,0,0,0.1)]';
    const textColor = isDark ? 'text-gray-300' : 'text-[#333]';
    const activeText = isDark ? 'text-white' : 'text-[#333]';

    return (
        <div className={`w-full h-full flex flex-col font-jersey overflow-hidden relative transition-colors duration-300 ${baseBg}`}>
            {/* Dynamic Background */}
            <BackgroundManager className="absolute inset-0 z-0 opacity-50" />

            {/* Pattern Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0" style={{
                backgroundImage: 'linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000)',
                backgroundSize: '4px 4px',
                backgroundPosition: '0 0, 2px 2px'
            }}></div>

            {/* Top Bar */}
            <div className={`h-6 ${topBarBg} border-b ${topBarBorder} flex justify-center items-center shrink-0 z-10 shadow-sm relative`}>
                <span className="text-gray-500 text-[10px] font-bold tracking-widest drop-shadow-sm">MOUSSANDOU OS</span>
            </div>

            {/* Grid */}
            <div
                ref={containerRef}
                className="flex-1 p-3 overflow-y-auto no-scrollbar scroll-smooth relative z-10"
            >
                <div className="grid grid-cols-2 gap-3 pb-2">
                    {paddedApps.map((app, index) => {
                        const isSelected = index === selectedIndex;
                        const isPlaceholder = (app.id as string) === 'placeholder';

                        return (
                            <div
                                key={index}
                                ref={isSelected ? selectedRef : null}
                                className={`aspect-square rounded-xl flex flex-col items-center justify-center relative transition-all duration-200 ${isSelected
                                    ? `${itemSelected} scale-105 -translate-y-1 z-20 border-4`
                                    : `${itemNormal} border-2 opacity-80 scale-95`
                                    }`}
                            >
                                {!isPlaceholder ? (
                                    <>
                                        <div className={`w-14 h-14 mb-1 transition-transform duration-300 filter drop-shadow-sm ${isSelected ? 'scale-110 rotate-3' : 'grayscale-[0.5]'}`}>
                                            {app.icon}
                                        </div>
                                        <div className="absolute bottom-1.5 w-full text-center px-1">
                                            <div className={`text-[10px] uppercase font-bold tracking-tight truncate w-full shadow-black ${isSelected ? activeText : 'text-gray-500'}`}>
                                                {app.name}
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="opacity-10 text-3xl text-gray-400 font-bold">·</div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Bottom Bar */}
            <div className={`h-6 ${bottomBarBg} border-t flex items-center justify-between px-3 text-[9px] text-gray-500 shrink-0 font-bold z-10 shadow-[0_-2px_4px_rgba(0,0,0,0.05)] relative`}>
                <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></div>
                    <span>ONLINE</span>
                </div>
                <span>{new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' })}</span>
            </div>
        </div>
    );
};
