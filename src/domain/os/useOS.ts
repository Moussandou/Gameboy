import { useState, useEffect, useRef, useCallback } from 'react';
import type { OSState, AppId } from './types';

const INPUT_COOLDOWN_MS = 180;

export const useOS = (input: Set<string>) => {
    const [status, setStatus] = useState<OSState>('BOOT');
    const [currentAppId, setCurrentAppId] = useState<AppId | null>(null);
    const [selectedAppIndex, setSelectedAppIndex] = useState(0);

    // Track which buttons were pressed last frame
    const prevInputRef = useRef<Set<string>>(new Set());
    // Track last action time per button
    const lastActionTime = useRef<Map<string, number>>(new Map());

    // Boot Sequence
    useEffect(() => {
        if (status === 'BOOT') {
            const timer = setTimeout(() => {
                setStatus('HOME');
            }, 3500);
            return () => clearTimeout(timer);
        }
    }, [status]);

    // Memoized action handler
    const handleInput = useCallback(() => {
        const now = Date.now();
        const prevInput = prevInputRef.current;

        // Find newly pressed buttons (in input but NOT in prevInput)
        const newlyPressed: string[] = [];
        input.forEach(btn => {
            if (!prevInput.has(btn)) {
                // Check cooldown
                const lastTime = lastActionTime.current.get(btn) || 0;
                if (now - lastTime >= INPUT_COOLDOWN_MS) {
                    newlyPressed.push(btn);
                    lastActionTime.current.set(btn, now);
                }
            }
        });

        // Update prevInput AFTER checking
        prevInputRef.current = new Set(input);

        // If no new presses, do nothing
        if (newlyPressed.length === 0) return;

        // Process only the first new press to avoid multiple actions
        const btn = newlyPressed[0];

        if (status === 'HOME') {
            const COLS = 2;
            const TOTAL_APPS = 4;

            if (btn === 'RIGHT') {
                setSelectedAppIndex(prev => {
                    if (prev % COLS === COLS - 1) return prev;
                    return Math.min(prev + 1, TOTAL_APPS - 1);
                });
            } else if (btn === 'LEFT') {
                setSelectedAppIndex(prev => {
                    if (prev % COLS === 0) return prev;
                    return Math.max(prev - 1, 0);
                });
            } else if (btn === 'DOWN') {
                setSelectedAppIndex(prev => Math.min(prev + COLS, TOTAL_APPS - 1));
            } else if (btn === 'UP') {
                setSelectedAppIndex(prev => Math.max(prev - COLS, 0));
            } else if (btn === 'A') {
                const apps: AppId[] = ['snake', 'settings', 'breakout', 'simon'];
                const selectedId = apps[selectedAppIndex];
                if (selectedId) {
                    setCurrentAppId(selectedId);
                    setStatus('APP_RUNNING');
                }
            }
        } else if (status === 'APP_RUNNING') {
            if (btn === 'SELECT') {
                setStatus('HOME');
                setCurrentAppId(null);
            }
        }
    }, [input, status, selectedAppIndex]);

    // Run on input change
    useEffect(() => {
        handleInput();
    }, [handleInput]);

    return {
        status,
        currentAppId,
        selectedAppIndex,
    };
};


