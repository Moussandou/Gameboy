import React from 'react';
import { useOS } from '../../domain/os/useOS';
import { BootScreen } from './BootScreen';
import { HomeScreen } from './HomeScreen';
import { APP_REGISTRY, getAppById } from '../../domain/os/appRegistry';

interface OSContainerProps {
    input: Set<string>;
    gameProps: Record<string, unknown>; // Props to pass to the game (Snake)
}

export const OSContainer: React.FC<OSContainerProps> = ({ input, gameProps }) => {
    const { status, currentAppId, selectedAppIndex } = useOS(input);

    if (status === 'BOOT') {
        return <BootScreen />;
    }

    if (status === 'HOME') {
        return (
            <div className="w-full h-full animate-fade-in">
                <HomeScreen apps={APP_REGISTRY} selectedIndex={selectedAppIndex} />
            </div>
        );
    }

    if (status === 'APP_RUNNING' && currentAppId) {
        const appDef = getAppById(currentAppId);
        if (appDef) {
            const App = appDef.component;
            return (
                <div className="w-full h-full animate-zoom-in">
                    {currentAppId === 'snake' ? (
                        <App {...gameProps} />
                    ) : (
                        <App input={input} />
                    )}
                </div>
            );
        }
    }

    return <div>Error: Unknown State</div>;
};
