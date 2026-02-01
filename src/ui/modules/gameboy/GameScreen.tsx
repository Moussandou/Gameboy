import React from 'react';
import type { Point } from '../../../domain/game/useSnake';

interface GameScreenProps {
    snake: Point[];
    food: Point;
    grid: { w: number; h: number };
    gameOver: boolean;
    score: number;
    isRunning: boolean;
}

export const GameScreen: React.FC<GameScreenProps> = ({ snake, food, grid, gameOver, score, isRunning }) => {
    const getStyle = (p: Point, color: string) => ({
        left: `${(p.x / grid.w) * 100}%`,
        top: `${(p.y / grid.h) * 100}%`,
        width: `${(1 / grid.w) * 100}%`,
        height: `${(1 / grid.h) * 100}%`,
        backgroundColor: color,
        position: 'absolute' as const,
    });

    return (
        <div className="relative w-full h-full bg-[#9bbc0f] font-mono">
            {/* Snake */}
            {snake.map((p, i) => (
                <div key={`s-${i}`} style={getStyle(p, '#0f380f')} className="rounded-[1px]" />
            ))}

            {/* Food */}
            <div style={getStyle(food, '#306230')} className="rounded-full animate-pulse" />

            {/* UI Overlay */}
            <div className="absolute top-1 left-2 text-[#0f380f] text-[10px] font-bold z-10">
                SCORE: {score}
            </div>

            {(!isRunning || gameOver) && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#9bbc0f]/80 z-20">
                    <h2 className="text-[#0f380f] font-bold text-xl mb-2">{gameOver ? 'GAME OVER' : 'READY'}</h2>
                    <p className="text-[#306230] text-xs blink">PRESS START</p>
                </div>
            )}
        </div>
    );
};
