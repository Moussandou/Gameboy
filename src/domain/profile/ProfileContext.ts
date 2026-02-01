import { createContext, useContext } from 'react';

export interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    isUnlocked: boolean;
    condition: (score: number, gameId: string) => boolean;
    rewardSkinId?: string; // ID of the skin this achievement unlocks
}

export interface GameRecord {
    gameId: string;
    highScore: number;
    lastPlayed: number; // timestamp
}

export interface UserProfile {
    name: string;
    avatar: string; // URL or preset ID
    title: string;
    totalGamesPlayed: number;
}

export interface ProfileState {
    profile: UserProfile;
    records: Record<string, GameRecord>; // gameId -> record
    achievements: Achievement[];

    updateProfile: (updates: Partial<UserProfile>) => void;
    submitScore: (gameId: string, score: number) => void;
    isSkinUnlocked: (skinId: string) => boolean;
}

export const ProfileContext = createContext<ProfileState | undefined>(undefined);

export const useProfile = () => {
    const context = useContext(ProfileContext);
    if (!context) {
        throw new Error('useProfile must be used within a ProfileProvider');
    }
    return context;
};
