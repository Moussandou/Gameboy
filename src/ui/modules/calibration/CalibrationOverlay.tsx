import React, { useState, useRef } from 'react';
import { useCalibration } from '../../../domain/calibration/CalibrationContext';
import type { ElementType, Rect } from '../../../domain/calibration/types';

const STEPS: { type: ElementType; label: string }[] = [
    { type: 'SCREEN', label: 'Draw the Screen Area' },
    { type: 'UP', label: 'Draw the Up Button' },
    { type: 'DOWN', label: 'Draw the Down Button' },
    { type: 'LEFT', label: 'Draw the Left Button' },
    { type: 'RIGHT', label: 'Draw the Right Button' },
    { type: 'A', label: 'Draw the A Button' },
    { type: 'B', label: 'Draw the B Button' },
    { type: 'START', label: 'Draw the Start Button' },
    { type: 'SELECT', label: 'Draw the Select Button' },
];

export const CalibrationOverlay: React.FC = () => {
    const { saveCalibration } = useCalibration();
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [currentRect, setCurrentRect] = useState<Rect | null>(null);
    const [tempData, setTempData] = useState<Record<string, Rect>>({});
    const [isDrawing, setIsDrawing] = useState(false);
    const startPos = useRef<{ x: number; y: number } | null>(null);

    const containerRef = useRef<HTMLDivElement>(null);

    const currentStep = STEPS[currentStepIndex];

    const getRelativeCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
        if (!containerRef.current) return { x: 0, y: 0 };

        const rect = containerRef.current.getBoundingClientRect();
        let clientX, clientY;

        if ('touches' in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = (e as React.MouseEvent).clientX;
            clientY = (e as React.MouseEvent).clientY;
        }

        // Convert to percentage (0-1)
        return {
            x: (clientX - rect.left) / rect.width,
            y: (clientY - rect.top) / rect.height
        };
    };

    const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
        // Check if clicking a button
        if ((e.target as HTMLElement).tagName === 'BUTTON') return;

        // Prevent scrolling on touch
        // e.preventDefault(); // Note: adding non-passive listener usually required for preventDefault
        const { x, y } = getRelativeCoordinates(e);
        startPos.current = { x, y };
        setIsDrawing(true);
        setCurrentRect({ x, y, width: 0, height: 0 });
    };

    const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing || !startPos.current) return;
        const { x, y } = getRelativeCoordinates(e);

        const width = x - startPos.current.x;
        const height = y - startPos.current.y;

        setCurrentRect({
            x: width > 0 ? startPos.current.x : x,
            y: height > 0 ? startPos.current.y : y,
            width: Math.abs(width),
            height: Math.abs(height),
        });
    };

    const handleEnd = () => {
        setIsDrawing(false);
    };

    const confirmStep = () => {
        if (currentRect && currentStep) {
            const newData = { ...tempData, [currentStep.type]: currentRect };
            setTempData(newData);
            setCurrentRect(null);
            startPos.current = null;

            if (currentStepIndex < STEPS.length - 1) {
                setCurrentStepIndex(prev => prev + 1);
            } else {
                console.log('Use this JSON in defaultConfig.ts:', JSON.stringify(newData));
                saveCalibration(newData);
            }
        }
    };

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-50 select-none touch-none"
            onMouseDown={handleStart}
            onMouseMove={handleMove}
            onMouseUp={handleEnd}
            onTouchStart={handleStart}
            onTouchMove={handleMove}
            onTouchEnd={handleEnd}
        >
            {/* Instructions */}
            <div className="absolute top-4 left-0 right-0 text-center pointer-events-none">
                <div className="inline-block bg-black/80 text-white px-4 py-2 rounded-lg text-lg font-bold backdrop-blur-sm border border-white/20">
                    {currentStep.label}
                </div>
                <div className="mt-2 text-sm text-white/80 bg-black/50 inline-block px-2 py-1 rounded">
                    Drag to define area • Click confirm when done
                </div>
            </div>

            {/* Existing Rects */}
            {Object.entries(tempData).map(([key, rect]) => (
                <div
                    key={key}
                    className="absolute border-2 border-green-500 bg-green-500/30"
                    style={{
                        left: `${rect.x * 100}%`,
                        top: `${rect.y * 100}%`,
                        width: `${rect.width * 100}%`,
                        height: `${rect.height * 100}%`,
                    }}
                />
            ))}

            {/* Current Drawing Rect */}
            {currentRect && (
                <div
                    className="absolute border-2 border-yellow-400 bg-yellow-400/30"
                    style={{
                        left: `${currentRect.x * 100}%`,
                        top: `${currentRect.y * 100}%`,
                        width: `${currentRect.width * 100}%`,
                        height: `${currentRect.height * 100}%`,
                    }}
                />
            )}

            {/* Confirm Button */}
            {currentRect && !isDrawing && (
                <div className="absolute bottom-10 left-0 right-0 flex justify-center pointer-events-auto">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            confirmStep();
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg border-2 border-white/20 active:scale-95 transition-transform"
                    >
                        Confirm {currentStep.type}
                    </button>
                </div>
            )}
        </div>
    );
};
