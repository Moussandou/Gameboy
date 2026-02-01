import React from 'react';
import { useSimon } from '../../domain/game/useSimon';
import type { SimonDirection } from '../../domain/game/useSimon';

interface SimonScreenProps {
    input: Set<string>;
}

const COLORS: Record<SimonDirection, { base: string; active: string }> = {
    UP: { base: 'bg-red-500', active: 'bg-red-300' },
    DOWN: { base: 'bg-blue-500', active: 'bg-blue-300' },
    LEFT: { base: 'bg-yellow-500', active: 'bg-yellow-300' },
    RIGHT: { base: 'bg-green-500', active: 'bg-green-300' },
};

export const SimonScreen: React.FC<SimonScreenProps> = ({ input }) => {
    const game = useSimon(input);
    const { activeButton, score, gameOver, isRunning, playerTurn, isShowingSequence } = game;

    const renderButton = (direction: SimonDirection, position: string) => {
        const isActive = activeButton === direction;
        const colors = COLORS[direction];

        return (
            <div
                className={`${position} absolute w-[40%] h-[40%] rounded-xl transition-all duration-100 flex items-center justify-center shadow-lg
                    ${isActive ? colors.active + ' scale-105' : colors.base}
                `}
            >
                <span className="text-white/50 text-2xl font-bold">
                    {direction === 'UP' && '▲'}
                    {direction === 'DOWN' && '▼'}
                    {direction === 'LEFT' && '◀'}
                    {direction === 'RIGHT' && '▶'}
                </span>
            </div>
        );
    };

    return (
        <div className="w-full h-full bg-[#1a1a2e] flex flex-col font-jersey relative overflow-hidden">
            {/* HUD */}
            <div className="absolute top-1 left-0 right-0 flex justify-between px-2 text-xs text-white/80 z-20">
                <span>SCORE: {score}</span>
                <span>{playerTurn ? 'YOUR TURN' : isShowingSequence ? 'WATCH...' : ''}</span>
            </div>

            {/* Game Area - 4 Quadrants */}
            <div className="flex-1 relative flex items-center justify-center p-4" style={{ marginTop: '12px' }}>
                <div className="relative w-full aspect-square max-w-[90%] max-h-[90%]">
                    {renderButton('UP', 'top-0 left-1/2 -translate-x-1/2')}
                    {renderButton('DOWN', 'bottom-0 left-1/2 -translate-x-1/2')}
                    {renderButton('LEFT', 'left-0 top-1/2 -translate-y-1/2')}
                    {renderButton('RIGHT', 'right-0 top-1/2 -translate-y-1/2')}

                    {/* Center Circle */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[25%] h-[25%] bg-[#2a2a4e] rounded-full flex items-center justify-center shadow-inner">
                        <span className="text-white/30 text-xs font-bold">SIMON</span>
                    </div>
                </div>
            </div>

            {/* Start/Game Over Overlay */}
            {(!isRunning || gameOver) && (
                <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-30">
                    {gameOver ? (
                        <>
                            <div className="text-2xl font-bold text-red-400 mb-2">GAME OVER</div>
                            <div className="text-white text-sm mb-4">Final Score: {score}</div>
                            <div className="text-gray-400 text-xs animate-pulse">Press A to Restart</div>
                        </>
                    ) : (
                        <>
                            <div className="text-xl font-bold text-white mb-2">MEMORY TONES</div>
                            <div className="text-gray-400 text-xs mb-4">Repeat the sequence!</div>
                            <div className="text-gray-400 text-xs animate-pulse">Press A to Start</div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};
