import React, { useState, useEffect, useRef } from 'react';
import { useProfile } from '../../domain/profile/ProfileContext';
import { useSystem } from '../../domain/os/SystemContext';

const AVATARS = [
    '/avatar.png',
    '/avatars/trainer_boy.png',
    '/avatars/trainer_girl.png',
    '/avatars/robot.png',
    '/avatars/ghost.png'
];

const TITLES = [
    'Retro Gamer',
    'Pixel Artist',
    'Speedrunner',
    'Pokemon Master',
    'Shiny Hunter',
    'Code Wizard',
    'Game Dev',
    'High Scorer'
];

const NAMES = [
    'Player 1',
    'Ash',
    'Red',
    'Blue',
    'Misty',
    'Brock',
    'Gary',
    'Team Rocket'
];

export const ProfileApp: React.FC<{ input?: Set<string> }> = ({ input }) => {
    const { profile, records, achievements, updateProfile } = useProfile();
    const { theme } = useSystem();
    const isDark = theme === 'dark';

    const [page, setPage] = useState<'INFO' | 'ACHIEVEMENTS' | 'SCORES'>('INFO');
    const [isEditing, setIsEditing] = useState(false);
    const [editField, setEditField] = useState<'AVATAR' | 'NAME' | 'TITLE'>('AVATAR');

    const prevInput = useRef<Set<string>>(new Set());
    const latestInput = useRef<Set<string>>(new Set());
    const scrollRef = useRef<HTMLDivElement>(null);

    // Field Refs for Auto-Scroll
    const avatarRef = useRef<HTMLDivElement>(null);
    const nameRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLDivElement>(null);

    // Keep latest input for the interval loop
    useEffect(() => {
        if (input) latestInput.current = input;
    }, [input]);

    // Discrete Actions (Triggers)
    useEffect(() => {
        if (!input) return;

        const isJustPressed = (btn: string) => input.has(btn) && !prevInput.current.has(btn);

        if (isEditing) {
            // --- EDIT MODE ---

            // Switch Fields
            if (isJustPressed('UP')) {
                setEditField(prev => prev === 'TITLE' ? 'NAME' : prev === 'NAME' ? 'AVATAR' : 'TITLE');
            }
            if (isJustPressed('DOWN')) {
                setEditField(prev => prev === 'AVATAR' ? 'NAME' : prev === 'NAME' ? 'TITLE' : 'AVATAR');
            }

            // Change Values
            if (isJustPressed('LEFT') || isJustPressed('RIGHT')) {
                const direction = isJustPressed('RIGHT') ? 1 : -1;

                if (editField === 'AVATAR') {
                    const currentIdx = AVATARS.indexOf(profile.avatar);
                    const safeIdx = currentIdx === -1 ? 0 : currentIdx;
                    const nextIdx = (safeIdx + direction + AVATARS.length) % AVATARS.length;
                    updateProfile({ avatar: AVATARS[nextIdx] });
                } else if (editField === 'NAME') {
                    const currentIdx = NAMES.indexOf(profile.name);
                    const nextIdx = (currentIdx + direction + NAMES.length) % NAMES.length;
                    updateProfile({ name: NAMES[nextIdx] });
                } else if (editField === 'TITLE') {
                    const currentIdx = TITLES.indexOf(profile.title);
                    const nextIdx = (currentIdx + direction + TITLES.length) % TITLES.length;
                    updateProfile({ title: TITLES[nextIdx] });
                }
            }

            // Save / Exit
            if (isJustPressed('A') || isJustPressed('B') || isJustPressed('START')) {
                setIsEditing(false);
            }

        } else {
            // --- VIEW MODE ---

            // Switch Tabs
            if (isJustPressed('RIGHT')) {
                setPage(p => p === 'INFO' ? 'ACHIEVEMENTS' : p === 'ACHIEVEMENTS' ? 'SCORES' : 'INFO');
            }
            if (isJustPressed('LEFT')) {
                setPage(p => p === 'SCORES' ? 'ACHIEVEMENTS' : p === 'ACHIEVEMENTS' ? 'INFO' : 'SCORES');
            }

            // Enter Edit Mode (Info Page Only)
            if (page === 'INFO' && (isJustPressed('A') || isJustPressed('START'))) {
                setIsEditing(true);
            }
        }

        prevInput.current = new Set(input);
    }, [input, isEditing, editField, page, profile, updateProfile]);

    // Continuous Actions (Scrolling) - Enabled in both modes now
    useEffect(() => {
        const scrollLoop = setInterval(() => {
            if (!latestInput.current) return;
            const held = latestInput.current;
            const el = scrollRef.current;

            if (el) {
                const SCROLL_SPEED = 15; // px per tick
                if (held.has('DOWN')) el.scrollTop += SCROLL_SPEED;
                if (held.has('UP')) el.scrollTop -= SCROLL_SPEED;
            }
        }, 30); // ~30fps

        return () => clearInterval(scrollLoop);
    }, []); // Run once on mount

    // Auto-Scroll to Active Field
    useEffect(() => {
        if (!isEditing) return;

        const ref = editField === 'AVATAR' ? avatarRef : editField === 'NAME' ? nameRef : titleRef;
        if (ref.current) {
            ref.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }, [editField, isEditing]);

    const totalScore = Object.values(records || {}).reduce((sum, r: any) => sum + (r?.highScore || 0), 0);
    const unlockedAchievements = achievements.filter(a => a.isUnlocked).length;

    // Theme Styles
    const baseBg = isDark ? 'bg-[#111]' : 'bg-[#f8f9fa]';
    const textBase = isDark ? 'text-gray-300' : 'text-gray-800';
    const headerBg = isDark ? 'bg-[#1a1a1a] border-[#333]' : 'bg-white border-gray-300';
    const cardBg = isDark ? 'bg-[#1a1a1a] border-[#333]' : 'bg-white border-gray-200';
    const subText = isDark ? 'text-gray-500' : 'text-gray-400';
    const avatarBorder = isDark ? 'border-[#333] bg-[#222]' : 'border-white bg-white';
    const editHighlight = isDark ? 'ring-2 ring-blue-500 bg-[#222]' : 'ring-2 ring-blue-400 bg-blue-50';

    return (
        <div className={`w-full h-full flex flex-col font-jersey relative overflow-hidden transition-colors duration-300 ${baseBg}`}>
            {/* Header */}
            <div className={`h-10 border-b flex items-center justify-between px-3 shadow-sm z-10 shrink-0 ${headerBg}`}>
                <span className={`text-lg font-bold tracking-widest ${textBase}`}>PROFILE</span>
                <div className="flex gap-1">
                    {['INFO', 'ACH', 'SCORE'].map((t, i) => (
                        <div key={t} className={`w-2 h-2 rounded-full ${(['INFO', 'ACHIEVEMENTS', 'SCORES'][i] === page) ? 'bg-blue-500' : (isDark ? 'bg-[#333]' : 'bg-gray-300')}`}></div>
                    ))}
                </div>
            </div>

            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto no-scrollbar p-4 scroll-smooth"
            >
                {page === 'INFO' && (
                    <div className="flex flex-col items-center animate-fade-in relative">
                        {isEditing && (
                            <div className="absolute top-0 right-0 py-1 px-2 bg-yellow-300 text-yellow-800 text-[10px] font-bold rounded shadow-sm animate-pulse z-20">
                                EDIT MODE
                            </div>
                        )}

                        {/* Avatar */}
                        <div ref={avatarRef} className={`relative w-24 h-24 rounded-2xl overflow-hidden border-4 shadow-md mb-4 transition-all scroll-mt-4 ${avatarBorder} ${isEditing && editField === 'AVATAR' ? 'ring-4 ring-blue-400 scale-105' : ''}`}>
                            <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                            {isEditing && editField === 'AVATAR' && (
                                <div className="absolute inset-x-0 bottom-0 bg-black/50 text-white text-[9px] text-center py-0.5">
                                    ◀ CHANGE ▶
                                </div>
                            )}
                        </div>

                        {/* Name */}
                        <div ref={nameRef} className={`mb-1 px-4 py-1 rounded transition-all scroll-mt-20 ${isEditing && editField === 'NAME' ? editHighlight : ''}`}>
                            <h2 className={`text-2xl font-bold text-center ${textBase}`}>{profile.name}</h2>
                            {isEditing && editField === 'NAME' && <div className="text-[9px] text-center text-blue-500 font-bold">◀ CHANGE ▶</div>}
                        </div>

                        {/* Title */}
                        <div ref={titleRef} className={`mb-6 px-4 py-1 rounded transition-all scroll-mt-24 ${isEditing && editField === 'TITLE' ? editHighlight : ''}`}>
                            <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-bold uppercase tracking-wide block text-center min-w-[120px]">
                                {profile.title}
                            </span>
                            {isEditing && editField === 'TITLE' && <div className="text-[9px] text-center text-blue-500 font-bold mt-1">◀ CHANGE ▶</div>}
                        </div>

                        <div className="grid grid-cols-2 gap-3 w-full">
                            <div className={`${cardBg} p-3 rounded-xl border shadow-sm flex flex-col items-center`}>
                                <span className={`${subText} text-[10px] items-center font-bold uppercase`}>Games Played</span>
                                <span className={`text-xl font-bold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>{profile.totalGamesPlayed}</span>
                            </div>
                            <div className={`${cardBg} p-3 rounded-xl border shadow-sm flex flex-col items-center`}>
                                <span className={`${subText} text-[10px] items-center font-bold uppercase`}>Unlocked</span>
                                <span className={`text-xl font-bold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>{unlockedAchievements}/{achievements.length}</span>
                            </div>
                        </div>

                        {/* Edit Prompt (Only visible when NOT editing) */}
                        {!isEditing && (
                            <div className={`mt-6 text-[10px] font-bold px-3 py-1 rounded-full border ${isDark ? 'bg-[#222] border-[#333] text-gray-500' : 'bg-gray-100 border-gray-300 text-gray-500'}`}>
                                PRESS START TO CUSTOMIZE
                            </div>
                        )}

                        {/* Save Button (Only visible when editing) */}
                        {isEditing && (
                            <div className="mt-6 flex flex-col items-center gap-1 animate-bounce">
                                <div className="px-4 py-1 bg-green-500 text-white font-bold rounded-lg shadow-sm text-xs">
                                    PRESS A TO SAVE
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {page === 'ACHIEVEMENTS' && (
                    <div className="space-y-3 animate-fade-in">
                        <h3 className={`text-xs font-bold uppercase mb-2 ${subText}`}>Achievements</h3>
                        {achievements.map(ach => (
                            <div key={ach.id} className={`p-3 rounded-xl border-2 flex items-center gap-3 ${ach.isUnlocked ? (isDark ? 'bg-[#222] border-yellow-600 shadow-sm' : 'bg-white border-yellow-400 shadow-sm') : 'bg-transparent border-transparent opacity-60'}`}>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${ach.isUnlocked ? 'bg-yellow-100 text-yellow-600' : (isDark ? 'bg-[#333] text-gray-600' : 'bg-gray-200 text-gray-400')}`}>
                                    {ach.isUnlocked ? '🏆' : '🔒'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className={`font-bold text-sm ${ach.isUnlocked ? (isDark ? 'text-gray-200' : 'text-gray-800') : 'text-gray-500'}`}>{ach.title}</h4>
                                    <p className={`text-[10px] truncate ${subText}`}>{ach.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {page === 'SCORES' && (
                    <div className="space-y-3 animate-fade-in">
                        <h3 className={`text-xs font-bold uppercase mb-2 ${subText}`}>High Scores</h3>

                        <div className={`${cardBg} p-4 rounded-xl border shadow-sm mb-3 text-center`}>
                            <span className={`${subText} text-[10px] uppercase font-bold`}>Total Score</span>
                            <div className="text-3xl font-bold text-blue-500">{totalScore}</div>
                        </div>

                        {Object.entries(records || {}).map(([gameId, record]: [string, any]) => (
                            <div key={gameId} className={`flex justify-between items-center p-3 rounded-lg border shadow-sm ${cardBg}`}>
                                <span className={`font-bold capitalize ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{gameId}</span>
                                <span className="font-mono text-gray-500">{record.highScore}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className={`h-8 border-t flex items-center justify-center shrink-0 ${isDark ? 'bg-[#222] border-[#333]' : 'bg-gray-50 border-gray-200'}`}>
                <span className={`text-[10px] ${subText}`}>
                    {page === 'INFO' && !isEditing ? 'START TO EDIT' : isEditing ? 'A TO SAVE • ⬅/➡ CHANGE' : '⬅/➡ SWITCH TAB • B BACK'}
                </span>
            </div>
        </div>
    );
};
