import React from 'react';
import { useOS } from '../../domain/os/useOS';
import { BootScreen } from './BootScreen';
import { HomeScreen } from './HomeScreen';
import { GameScreen } from '../modules/gameboy/GameScreen';
import { SettingsApp } from '../apps/SettingsApp';
import { BreakoutScreen } from '../apps/BreakoutScreen';
import { SimonScreen } from '../apps/SimonScreen';
import type { AppConfig } from '../../domain/os/types';

// App Registry
const APPS: AppConfig[] = [
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
];

interface OSContainerProps {
    input: Set<string>;
    gameProps: any; // Props to pass to the game (Snake)
}

export const OSContainer: React.FC<OSContainerProps> = ({ input, gameProps }) => {
    const { status, currentAppId, selectedAppIndex } = useOS(input);

    if (status === 'BOOT') {
        return <BootScreen />;
    }

    if (status === 'HOME') {
        return <HomeScreen apps={APPS} selectedIndex={selectedAppIndex} />;
    }

    if (status === 'APP_RUNNING' && currentAppId) {
        const App = APPS.find(a => a.id === currentAppId)?.component;
        if (App) {
            if (currentAppId === 'snake') {
                return <App {...gameProps} />;
            }
            // Pass input for apps that need it (Settings, Breakout)
            return <App input={input} />;
        }
    }

    return <div>Error: Unknown State</div>;
};
