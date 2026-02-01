import { useState, useEffect, useRef } from 'react';
import type { OSState, AppId } from './types';


export const useOS = (input: Set<string>) => {
    const [status, setStatus] = useState<OSState>('BOOT');
    const [currentAppId, setCurrentAppId] = useState<AppId | null>(null);
    const [selectedAppIndex, setSelectedAppIndex] = useState(0);

    // Track previous input to detect "new" presses (rising edge)
    const prevInput = useRef<Set<string>>(new Set());

    // Boot Sequence
    useEffect(() => {
        if (status === 'BOOT') {
            const timer = setTimeout(() => {
                setStatus('HOME');
            }, 3500); // 3.5s boot time
            return () => clearTimeout(timer);
        }
    }, [status]);

    // Input Handling
    useEffect(() => {
        const isJustPressed = (btn: string) => input.has(btn) && !prevInput.current.has(btn);

        if (status === 'HOME') {
            const COLS = 2; // 2 Columns for the grid
            const TOTAL_APPS = 4; // We will have placeholders

            if (isJustPressed('RIGHT')) {
                setSelectedAppIndex(prev => {
                    if (prev % COLS === COLS - 1) return prev; // End of row
                    return Math.min(prev + 1, TOTAL_APPS - 1);
                });
            }
            if (isJustPressed('LEFT')) {
                setSelectedAppIndex(prev => {
                    if (prev % COLS === 0) return prev; // Start of row
                    return Math.max(prev - 1, 0);
                });
            }
            if (isJustPressed('DOWN')) {
                setSelectedAppIndex(prev => Math.min(prev + COLS, TOTAL_APPS - 1));
            }
            if (isJustPressed('UP')) {
                setSelectedAppIndex(prev => Math.max(prev - COLS, 0));
            }

            if (isJustPressed('A')) {
                const apps: AppId[] = ['snake', 'settings'];
                const selectedId = apps[selectedAppIndex];
                if (selectedId) {
                    setCurrentAppId(selectedId);
                    setStatus('APP_RUNNING');
                    // Sound is already played by Emulator
                }
            }
        } else if (status === 'APP_RUNNING') {
            if (isJustPressed('SELECT')) {
                setStatus('HOME');
                setCurrentAppId(null);
            }
        }

        // Update previous input for the next cycle
        // We clone the Set to ensure we have a snapshot of the current state
        prevInput.current = new Set(input);
    }, [input, status, selectedAppIndex]);

    return {
        status,
        currentAppId,
        selectedAppIndex,
    };
};
