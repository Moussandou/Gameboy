import React, { useState, useEffect, useCallback } from 'react';
import { ProfileContext, type UserProfile, type GameRecord, type Achievement } from './ProfileContext';


const STORAGE_KEY_PROFILE = 'gb_profile_v1';
const STORAGE_KEY_RECORDS = 'gb_records_v1';
const STORAGE_KEY_ACHIEVEMENTS = 'gb_achievements_v1';

const DEFAULT_PROFILE: UserProfile = {
    name: 'Player 1',
    avatar: '/avatar.png',
    title: 'Retro Gamer',
    totalGamesPlayed: 0
};

// Define Core Achievements
const INITIAL_ACHIEVEMENTS: Achievement[] = [
    {
        id: 'newbie',
        title: 'First Steps',
        description: 'Play your first game',
        icon: '🎮',
        isUnlocked: false,
        condition: (_, __) => true, // Unlocks on first score submission
    },
    {
        id: 'snake_novice',
        title: 'Snake Charmer',
        description: 'Score 10 points in Snake',
        icon: '🐍',
        isUnlocked: false,
        condition: (score, gameId) => gameId === 'snake' && score >= 10,
        rewardSkinId: 'pikachu'
    },
    {
        id: 'snake_master',
        title: 'Snake Master',
        description: 'Score 50 points in Snake',
        icon: '👑',
        isUnlocked: false,
        condition: (score, gameId) => gameId === 'snake' && score >= 50,
        rewardSkinId: 'mew'
    },
    {
        id: 'tetris_pro',
        title: 'Tetris Pro',
        description: 'Score 1000 points in Tetris',
        icon: '🧱',
        isUnlocked: false,
        condition: (score, gameId) => gameId === 'tetris' && score >= 1000,
        rewardSkinId: 'lugia'
    }
];

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // State
    const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
    const [records, setRecords] = useState<Record<string, GameRecord>>({});
    const [achievements, setAchievements] = useState<Achievement[]>(INITIAL_ACHIEVEMENTS);

    // Load Data on Mount
    useEffect(() => {
        try {
            const storedProfile = localStorage.getItem(STORAGE_KEY_PROFILE);
            const storedRecords = localStorage.getItem(STORAGE_KEY_RECORDS);
            const storedAchievements = localStorage.getItem(STORAGE_KEY_ACHIEVEMENTS);

            if (storedProfile) setProfile(JSON.parse(storedProfile));
            if (storedRecords) setRecords(JSON.parse(storedRecords));

            if (storedAchievements) {
                // Merge stored status with definition (to keep conditions)
                const savedStatus = JSON.parse(storedAchievements) as { id: string, isUnlocked: boolean }[];
                setAchievements(prev => prev.map(ach => {
                    const saved = savedStatus.find(s => s.id === ach.id);
                    return saved ? { ...ach, isUnlocked: saved.isUnlocked } : ach;
                }));
            }
        } catch (e) {
            console.error('Failed to load profile data', e);
        }
    }, []);

    // Persist Helpers
    const saveProfile = (p: UserProfile) => {
        setProfile(p);
        localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(p));
    };

    const saveRecords = (r: Record<string, GameRecord>) => {
        setRecords(r);
        localStorage.setItem(STORAGE_KEY_RECORDS, JSON.stringify(r));
    };

    const saveAchievements = (a: Achievement[]) => {
        setAchievements(a);
        const toSave = a.map(({ id, isUnlocked }) => ({ id, isUnlocked }));
        localStorage.setItem(STORAGE_KEY_ACHIEVEMENTS, JSON.stringify(toSave));
    };

    // Actions
    const updateProfile = useCallback((updates: Partial<UserProfile>) => {
        saveProfile({ ...profile, ...updates });
    }, [profile]);

    const submitScore = useCallback((gameId: string, score: number) => {
        // Update Record
        const currentRecord = records[gameId]?.highScore || 0;
        if (score > currentRecord) {
            const newRecord: GameRecord = {
                gameId,
                highScore: score,
                lastPlayed: Date.now()
            };
            saveRecords({ ...records, [gameId]: newRecord });
        }

        // Update Total Games Played
        updateProfile({ totalGamesPlayed: profile.totalGamesPlayed + 1 });

        // Check Achievements
        let newUnlocks = false;
        const updatedAchievements = achievements.map(ach => {
            if (!ach.isUnlocked && ach.condition(score, gameId)) {
                newUnlocks = true;
                // Could trigger a toast notification here
                return { ...ach, isUnlocked: true };
            }
            return ach;
        });

        if (newUnlocks) {
            saveAchievements(updatedAchievements);
        }
    }, [records, achievements, profile, updateProfile]);

    const isSkinUnlocked = useCallback((skinId: string) => {
        // Base skins are always unlocked
        if (skinId === 'original') return true;

        // Check if any unlocked achievement rewards this skin
        return achievements.some(ach => ach.isUnlocked && ach.rewardSkinId === skinId);
    }, [achievements]);

    return (
        <ProfileContext.Provider value={{ profile, records, achievements, updateProfile, submitScore, isSkinUnlocked }}>
            {children}
        </ProfileContext.Provider>
    );
};
