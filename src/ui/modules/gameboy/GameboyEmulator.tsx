import React, { useRef, useState } from 'react';
import { useCalibration } from '../../../domain/calibration/CalibrationContext';
import { getPressedButton } from '../../../domain/input/logic';
import { audioService } from '../../../infra/AudioService';
import { useSnake } from '../../../domain/game/useSnake';
import { GameScreen } from './GameScreen';

export const GameboyEmulator: React.FC = () => {
    const { data, resetCalibration } = useCalibration();
    const [pressedButtons, setPressedButtons] = useState<Set<string>>(new Set());
    const containerRef = useRef<HTMLDivElement>(null);

    // Game Logic
    const gameState = useSnake(pressedButtons);

    const handleInput = (e: React.TouchEvent | React.MouseEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();

        // e.preventDefault(); // Prevent default browser scrolling/zooming

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

        // Detect new presses for sound
        newPressed.forEach(btn => {
            if (!pressedButtons.has(btn)) {
                audioService.playButtonPress();
                if (window.navigator && window.navigator.vibrate) {
                    window.navigator.vibrate(10);
                }
            }
        });

        setPressedButtons(newPressed);
    };

    const clearInput = () => {
        setPressedButtons(new Set());
    };

    const screenRect = data['SCREEN'];

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
                    className="absolute bg-[#9bbc0f] overflow-hidden flex items-center justify-center shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]"
                    style={{
                        left: `${screenRect.x * 100}%`,
                        top: `${screenRect.y * 100}%`,
                        width: `${screenRect.width * 100}%`,
                        height: `${screenRect.height * 100}%`,
                    }}
                >
                    <GameScreen {...gameState} />

                    {/* Scanlines Effect */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%] pointer-events-none" />
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
