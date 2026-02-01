import React, { useState, useEffect, useRef } from 'react';
import { useSystem } from '../../domain/os/SystemContext';
import { useCalibration } from '../../domain/calibration/CalibrationContext';
import { useProfile } from '../../domain/profile/ProfileContext';
import { AVAILABLE_SKINS } from '../../domain/calibration/constants';

const ROWS = 7; // Volume, Brightness, Theme, Skin, Wallpaper, Music, Recalibrate
const WALLPAPERS = ['default', 'particles', 'clouds'];

export const SettingsApp: React.FC<{ input?: Set<string> }> = ({ input }) => {
    const { volume, brightness, musicEnabled, wallpaper, theme, setVolume, setBrightness, toggleMusic, setWallpaper, toggleTheme } = useSystem();
    const { currentSkin, setSkin, resetCalibration } = useCalibration();
    const { isSkinUnlocked } = useProfile();
    const [selectedRow, setSelectedRow] = useState(0);
    const prevInput = useRef<Set<string>>(new Set());
    const containerRef = useRef<HTMLDivElement>(null);
    const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        if (!input) return;

        const isJustPressed = (btn: string) => input.has(btn) && !prevInput.current.has(btn);

        if (isJustPressed('DOWN')) {
            setTimeout(() => setSelectedRow(prev => Math.min(prev + 1, ROWS - 1)), 0);
        }
        if (isJustPressed('UP')) {
            setTimeout(() => setSelectedRow(prev => Math.max(prev - 1, 0)), 0);
        }

        if (selectedRow === 0) { // Volume
            if (isJustPressed('LEFT')) setVolume(volume - 1);
            if (isJustPressed('RIGHT')) setVolume(volume + 1);
        } else if (selectedRow === 1) { // Brightness
            if (isJustPressed('LEFT')) setBrightness(brightness - 1);
            if (isJustPressed('RIGHT')) setBrightness(brightness + 1);
        } else if (selectedRow === 2) { // Theme
            if (isJustPressed('A') || isJustPressed('LEFT') || isJustPressed('RIGHT')) {
                toggleTheme();
            }
        } else if (selectedRow === 3) { // Skin
            const currentIndex = AVAILABLE_SKINS.findIndex((s: { path: string }) => s.path === currentSkin);
            if (isJustPressed('LEFT') || isJustPressed('RIGHT')) {
                let nextIndex = currentIndex;
                let attempts = 0;
                const direction = isJustPressed('LEFT') ? -1 : 1;

                // Try to find the next unlocked skin
                do {
                    nextIndex = (nextIndex + direction + AVAILABLE_SKINS.length) % AVAILABLE_SKINS.length;
                    attempts++;
                } while (!isSkinUnlocked(AVAILABLE_SKINS[nextIndex].id) && attempts < AVAILABLE_SKINS.length);

                if (isSkinUnlocked(AVAILABLE_SKINS[nextIndex].id)) {
                    setSkin(AVAILABLE_SKINS[nextIndex].path);
                }
            }
        } else if (selectedRow === 4) { // Wallpaper
            const currentIndex = WALLPAPERS.indexOf(wallpaper);
            if (isJustPressed('LEFT')) {
                const nextIndex = (currentIndex - 1 + WALLPAPERS.length) % WALLPAPERS.length;
                setWallpaper(WALLPAPERS[nextIndex]);
            }
            if (isJustPressed('RIGHT')) {
                const nextIndex = (currentIndex + 1) % WALLPAPERS.length;
                setWallpaper(WALLPAPERS[nextIndex]);
            }
        } else if (selectedRow === 5) { // Music Toggle
            if (isJustPressed('A') || isJustPressed('LEFT') || isJustPressed('RIGHT')) {
                toggleMusic();
            }
        } else if (selectedRow === 6) { // Recalibrate
            if (isJustPressed('A')) {
                resetCalibration();
            }
        }

        prevInput.current = new Set(input);
    }, [input, selectedRow, volume, brightness, theme, setVolume, setBrightness, toggleMusic, setWallpaper, toggleTheme, currentSkin, setSkin, resetCalibration, isSkinUnlocked, wallpaper]);

    // Scroll Logic
    useEffect(() => {
        if (containerRef.current && rowRefs.current[selectedRow]) {
            const container = containerRef.current;
            const element = rowRefs.current[selectedRow];

            if (element) {
                // Special case for first item: always scroll to top
                if (selectedRow === 0) {
                    container.scrollTo({ top: 0, behavior: 'smooth' });
                    return;
                }

                const containerTop = container.scrollTop;
                const containerBottom = containerTop + container.clientHeight;
                const elemTop = element.offsetTop;
                const elemBottom = elemTop + element.clientHeight;
                const PADDING = 16;

                if (elemBottom > containerBottom) {
                    container.scrollTo({ top: elemBottom - container.clientHeight + PADDING, behavior: 'smooth' });
                } else if (elemTop < containerTop) {
                    container.scrollTo({ top: elemTop - PADDING, behavior: 'smooth' });
                }
            }
        }
    }, [selectedRow]);

    const currentSkinName = AVAILABLE_SKINS.find((s: { path: string }) => s.path === currentSkin)?.name || 'Unknown';
    const isDark = theme === 'dark';

    const baseBg = isDark ? 'bg-[#111]' : 'bg-[#eeeeee]';
    const cardBg = isDark ? 'bg-[#1a1a1a] border-[#333]' : 'bg-transparent border-transparent opacity-80';
    const activeCardBg = isDark ? 'bg-[#222] border-[#5acbf7] shadow-lg scale-105' : 'bg-white border-[#5acbf7] shadow-lg scale-105';
    const textColor = isDark ? 'text-gray-300' : 'text-gray-500';
    const textValueColor = isDark ? 'text-white' : 'text-gray-800';
    const headerBg = isDark ? 'bg-[#1a1a1a] border-[#333]' : 'bg-white border-gray-300';
    const headerText = isDark ? 'text-gray-300 bg-[#1a1a1a]' : 'text-gray-600 bg-white';

    const renderRow = (index: number, children: React.ReactNode) => (
        <div
            key={index}
            ref={(el) => { rowRefs.current[index] = el; }}
            className={`transition-all duration-200 p-3 rounded-xl border-2 shrink-0 ${selectedRow === index ? activeCardBg : cardBg}`}
        >
            {children}
        </div>
    );

    return (
        <div className={`w-full h-full flex flex-col font-jersey relative overflow-hidden transition-colors duration-300 ${baseBg}`}>
            {/* Header */}
            <div className={`h-10 border-b flex items-center justify-center shadow-sm z-10 shrink-0 ${headerBg}`}>
                <span className={`text-lg font-bold tracking-widest px-4 z-10 ${headerText}`}>SETTINGS</span>
            </div>

            <div
                ref={containerRef}
                className="flex-1 p-4 space-y-4 flex flex-col justify-start overflow-y-auto no-scrollbar"
            >
                {/* Volume Control */}
                {renderRow(0, (
                    <>
                        <div className="flex justify-between items-center mb-2">
                            <span className={`${textColor} font-bold text-sm`}>Volume</span>
                            <span className="text-blue-400 font-bold text-sm">{volume * 10}%</span>
                        </div>
                        <div className="flex gap-1 h-2">
                            {[...Array(10)].map((_, i) => (
                                <div
                                    key={i}
                                    className={`flex-1 rounded-sm transition-colors ${i < volume ? 'bg-blue-400' : (isDark ? 'bg-[#333]' : 'bg-gray-200')}`}
                                ></div>
                            ))}
                        </div>
                    </>
                ))}

                {/* Brightness Control */}
                {renderRow(1, (
                    <>
                        <div className="flex justify-between items-center mb-2">
                            <span className={`${textColor} font-bold text-sm`}>Brightness</span>
                            <span className="text-yellow-400 font-bold text-sm">{brightness * 10}%</span>
                        </div>
                        <div className="flex gap-1 h-2">
                            {[...Array(10)].map((_, i) => (
                                <div
                                    key={i}
                                    className={`flex-1 rounded-sm transition-colors ${i < brightness ? 'bg-yellow-400' : (isDark ? 'bg-[#333]' : 'bg-gray-200')}`}
                                ></div>
                            ))}
                        </div>
                    </>
                ))}

                {/* Theme Toggle */}
                {renderRow(2, (
                    <div className="flex justify-between items-center">
                        <span className={`${textColor} font-bold text-sm`}>App Theme</span>
                        <div className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${isDark ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
                            {isDark ? 'DARK' : 'LIGHT'}
                        </div>
                    </div>
                ))}

                {/* Skin Selector */}
                {renderRow(3, (
                    <>
                        <div className="flex justify-between items-center mb-1">
                            <span className={`${textColor} font-bold text-sm`}>Console Skin</span>
                        </div>
                        <div className={`flex justify-between items-center rounded-lg p-2 ${isDark ? 'bg-[#222]' : 'bg-gray-100'}`}>
                            <span className="text-gray-400 text-xs">◀</span>
                            <span className={`${textValueColor} font-bold text-sm`}>{currentSkinName}</span>
                            <span className="text-gray-400 text-xs">▶</span>
                        </div>
                    </>
                ))}

                {/* Wallpaper Selector */}
                {renderRow(4, (
                    <>
                        <div className="flex justify-between items-center mb-1">
                            <span className={`${textColor} font-bold text-sm`}>Wallpaper</span>
                        </div>
                        <div className={`flex justify-between items-center rounded-lg p-2 ${isDark ? 'bg-[#222]' : 'bg-gray-100'}`}>
                            <span className="text-gray-400 text-xs">◀</span>
                            <span className={`${textValueColor} font-bold text-sm capitalize`}>{wallpaper.replace('-', ' ')}</span>
                            <span className="text-gray-400 text-xs">▶</span>
                        </div>
                    </>
                ))}

                {/* Music Toggle */}
                {renderRow(5, (
                    <div className="flex justify-between items-center">
                        <span className={`${textColor} font-bold text-sm`}>Music</span>
                        <div className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${musicEnabled ? 'bg-green-400 text-white' : (isDark ? 'bg-[#333] text-gray-500' : 'bg-gray-300 text-gray-500')}`}>
                            {musicEnabled ? 'ON' : 'OFF'}
                        </div>
                    </div>
                ))}

                {/* Recalibrate */}
                {renderRow(6, (
                    <div className="flex justify-between items-center">
                        <span className={`${textColor} font-bold text-sm`}>Recalibrate</span>
                        <div className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-500">
                            Press A
                        </div>
                    </div>
                ))}

                {/* Hint */}
                <div className="pb-4 text-center text-[10px] text-gray-400 tracking-wider shrink-0 mt-auto pt-4">
                    D-PAD to Adjust • A to Toggle • SELECT to Exit
                </div>
            </div>
        </div>
    );
};
