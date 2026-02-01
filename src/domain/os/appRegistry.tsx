import React from 'react';
import type { AppId } from './types';

// Static imports
import { GameScreen } from '../../ui/modules/gameboy/GameScreen';
import { SettingsApp } from '../../ui/apps/SettingsApp';
import { BreakoutScreen } from '../../ui/apps/BreakoutScreen';
import { SimonScreen } from '../../ui/apps/SimonScreen';
import { ClockApp } from '../../ui/apps/ClockApp';
import { TetrisScreen } from '../../ui/apps/TetrisScreen';
import { CreditsApp } from '../../ui/apps/CreditsApp';
import { ProfileApp } from '../../ui/apps/ProfileApp';

// Centralized App Registry - Add new apps here only
export interface AppDefinition {
    id: AppId;
    name: string;
    icon: React.ReactNode;
    component: React.ComponentType<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
}

// Single source of truth for all apps
export const APP_REGISTRY: AppDefinition[] = [
    {
        id: 'snake',
        name: 'Snake Game',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full text-green-600">
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <path d="M8 12h4" /><path d="M16 12h.01" />
            </svg>
        ),
        component: GameScreen
    },
    {
        id: 'profile',
        name: 'Profile',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full text-indigo-500">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
            </svg>
        ),
        component: ProfileApp
    },
    {
        id: 'settings',
        name: 'Settings',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full text-gray-600">
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.47a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" />
            </svg>
        ),
        component: SettingsApp
    },
    {
        id: 'breakout',
        name: 'Wall Breaker',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full text-orange-500">
                <rect x="2" y="4" width="20" height="3" rx="1" />
                <rect x="2" y="9" width="20" height="3" rx="1" />
                <circle cx="12" cy="18" r="2" />
                <rect x="8" y="21" width="8" height="2" rx="1" />
            </svg>
        ),
        component: BreakoutScreen
    },
    {
        id: 'simon',
        name: 'Memory Tones',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full text-purple-500">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2v10l7 4" />
            </svg>
        ),
        component: SimonScreen
    },
    {
        id: 'clock',
        name: 'Clock',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full text-blue-500">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
            </svg>
        ),
        component: ClockApp
    },
    {
        id: 'tetris',
        name: 'Block Stack',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full text-cyan-500">
                <path d="M2 14h4v-4h4v-4h4v4h4v4h4" />
                <rect x="2" y="14" width="20" height="8" rx="1" opacity="0.5" />
            </svg>
        ),
        component: TetrisScreen
    },
    {
        id: 'credits',
        name: 'Credits',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full text-pink-500">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
        ),
        component: CreditsApp
    },
];

// Helper functions - use these instead of hardcoded values
export const getAppCount = (): number => APP_REGISTRY.length;
export const getAppIds = (): AppId[] => APP_REGISTRY.map(app => app.id);
export const getAppById = (id: AppId): AppDefinition | undefined =>
    APP_REGISTRY.find(app => app.id === id);
