import React, { useRef, useState, useEffect } from 'react';
import { useCalibration } from '../../../domain/calibration/CalibrationContext';
import { getPressedButton } from '../../../domain/input/logic';
import { audioService } from '../../../infra/AudioService';
import { useSnake } from '../../../domain/game/useSnake';
import { SystemProvider } from '../../../domain/os/SystemContext';

import { OSContainer } from '../../os/OSContainer';

export const GameboyEmulator: React.FC = () => {
    const { data, resetCalibration } = useCalibration();
    const [pressedButtons, setPressedButtons] = useState<Set<string>>(new Set());
    const containerRef = useRef<HTMLDivElement>(null);

    // Game Logic
    const gameState = useSnake(pressedButtons);

    const handleInput = (e: React.TouchEvent | React.MouseEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();

        // Prevent ghost mouse events and default browser behavior (scrolling/zooming)
        if (e.cancelable) {
            e.preventDefault();
        }

        const newPressed = new Set<string>();
        const points: { x: number; y: number }[] = [];

        if ('touches' in e) {
            for (let i = 0; i < e.touches.length; i++) {
                points.push({ x: e.touches[i].clientX, y: e.touches[i].clientY });
            }
        } else {
            points.push({ x: (e as React.MouseEvent).clientX, y: (e as React.MouseEvent).clientY });
        }

        // Convert points to percentage relative to container
        points.forEach(({ x, y }) => {
            const relX = (x - rect.left) / rect.width;
            const relY = (y - rect.top) / rect.height;

            const btn = getPressedButton(relX, relY, data);
            if (btn) {
                newPressed.add(btn);
            }
        });

        // Check if state actually changed to avoid re-renders
        let changed = false;
        if (newPressed.size !== pressedButtons.size) {
            changed = true;
        } else {
            for (const btn of newPressed) {
                if (!pressedButtons.has(btn)) {
                    changed = true;
                    break;
                }
            }
        }

        // Detect new presses for sound
        newPressed.forEach(btn => {
            if (!pressedButtons.has(btn)) {
                audioService.playButtonPress();
                if (window.navigator && window.navigator.vibrate) {
                    window.navigator.vibrate(10);
                }
            }
        });

        if (changed) {
            setPressedButtons(newPressed);
        }
    };

    const clearInput = () => {
        if (pressedButtons.size > 0) {
            setPressedButtons(new Set());
        }
    };

    const screenRect = data['SCREEN'];

    const [audioStarted, setAudioStarted] = useState(false);

    useEffect(() => {
        // Attach non-passive listener to prevent Default
        const container = containerRef.current;
        if (!container) return;

        const preventDefault = (e: TouchEvent) => {
            if (e.cancelable) e.preventDefault();
        };

        // We need non-passive to call preventDefault
        container.addEventListener('touchstart', preventDefault, { passive: false });
        container.addEventListener('touchmove', preventDefault, { passive: false });
        container.addEventListener('touchend', preventDefault, { passive: false });

        return () => {
            container.removeEventListener('touchstart', preventDefault);
            container.removeEventListener('touchmove', preventDefault);
            container.removeEventListener('touchend', preventDefault);
        };
    }, []);

    const startSystem = () => {
        audioService.resume();
        setAudioStarted(true);
    };

    if (!audioStarted) {
        return (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 text-white cursor-pointer" onClick={startSystem} onTouchStart={startSystem}>
                <div className="text-center animate-pulse">
                    <p className="text-xl font-bold mb-2">TAP TO START</p>
                    <p className="text-xs text-gray-400">Initialize Audio & System</p>
                </div>
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 z-10 touch-none select-none"
            onTouchStart={handleInput}
            onTouchMove={handleInput}
            onTouchEnd={handleInput}
            onMouseDown={handleInput} // For debugging on desktop
            onMouseMove={(e) => { if (e.buttons === 1) handleInput(e); }}
            onMouseUp={clearInput}
        >
            {/* Visual Feedback for Buttons */}
            {Object.entries(data).map(([key, rect]) => {
                if (key === 'SCREEN') return null;
                const isPressed = pressedButtons.has(key);
                return (
                    <div
                        key={key}
                        className={`absolute rounded-full transition-opacity duration-75 ${isPressed ? 'bg-white/40 opacity-100' : 'opacity-0'
                            }`}
                        style={{
                            left: `${rect.x * 100}%`,
                            top: `${rect.y * 100}%`,
                            width: `${rect.width * 100}%`,
                            height: `${rect.height * 100}%`,
                        }}
                    />
                );
            })}

            {/* Game Screen Content */}
            {screenRect && (
                <div
                    className="absolute bg-[#1a1a1a] overflow-hidden flex items-center justify-center shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]"
                    style={{
                        left: `${screenRect.x * 100}%`,
                        top: `${screenRect.y * 100}%`,
                        width: `${screenRect.width * 100}%`,
                        height: `${screenRect.height * 100}%`,
                    }}
                >
                    {/* Screen Content */}
                    <div className="absolute inset-0 w-full h-full bg-[#eeeeee] overflow-hidden rounded-sm shadow-inner z-10">
                        <SystemProvider>
                            <OSContainer input={pressedButtons} gameProps={gameState} />
                        </SystemProvider>

                        {/* Screen Glare/Reflection */}
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,255,0,0.06))] z-10 bg-[length:100%_2px,3px_100%] pointer-events-none" />
                    </div>
                </div>
            )}

            {/* Reset Button (Hidden or small) */}
            <div className="fixed top-2 right-2 flex gap-2 z-50 pointer-events-auto">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        resetCalibration();
                    }}
                    className="p-2 bg-black/20 text-white/50 text-xs rounded hover:bg-black/50"
                >
                    Recalibrate
                </button>
            </div>
        </div>
    );
};
