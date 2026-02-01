import React from 'react';
import { useBreakout } from '../../domain/game/useBreakout';
import { useSystem } from '../../domain/os/SystemContext';

interface BreakoutScreenProps {
    input: Set<string>;
}

export const BreakoutScreen: React.FC<BreakoutScreenProps> = ({ input }) => {
    const game = useBreakout(input);
    const { theme } = useSystem();
    const isDark = theme === 'dark';

    const {
        paddleX, ballX, ballY, bricks, score, lives, gameOver, won, isRunning,
        dimensions, paddleDimensions, ballSize, brickDimensions
    } = game;

    // Theme values
    const bgClass = isDark ? 'bg-[#1a1a2e]' : 'bg-[#f0f0f0]';
    const textBase = isDark ? 'text-white/80' : 'text-gray-600';
    const paddleGradient = isDark ? 'from-white to-gray-300' : 'from-blue-500 to-blue-700';

    // Calculate scaling
    const scaleX = (val: number) => (val / dimensions.width) * 100;
    const scaleY = (val: number) => (val / dimensions.height) * 100;

    return (
        <div className={`w-full h-full ${bgClass} flex flex-col font-jersey relative overflow-hidden transition-colors duration-300`}>
            {/* HUD */}
            <div className={`absolute top-1 left-0 right-0 flex justify-between px-2 text-xs z-20 font-bold ${textBase}`}>
                <span>SCORE: {score}</span>
                <span>LIVES: {'❤️'.repeat(lives)}</span>
            </div>

            {/* Game Area */}
            <div className="flex-1 relative" style={{ marginTop: '12px' }}>
                {/* Background Grid Pattern */}
                <div className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: 'radial-gradient(circle, #888 1px, transparent 1px)', backgroundSize: '10px 10px' }}
                ></div>

                {/* Bricks */}
                {bricks.map((brick, i) => brick.alive && (
                    <div
                        key={i}
                        className="absolute transition-opacity duration-100"
                        style={{
                            left: `${scaleX(brick.x)}%`,
                            top: `${scaleY(brick.y)}%`,
                            width: `${scaleX(brickDimensions.width) - 0.5}%`,
                            height: `${scaleY(brickDimensions.height) - 1}%`,
                            backgroundColor: brick.color,
                            borderRadius: '2px',
                            boxShadow: 'inset 0 -2px 0 rgba(0,0,0,0.3)',
                        }}
                    />
                ))}

                {/* Ball */}
                <div
                    className={`absolute rounded-full shadow-lg ${isDark ? 'bg-white' : 'bg-gray-800'}`}
                    style={{
                        left: `${scaleX(ballX)}%`,
                        top: `${scaleY(ballY)}%`,
                        width: `${scaleX(ballSize)}%`,
                        height: `${scaleY(ballSize)}%`,
                        boxShadow: isDark ? '0 0 8px rgba(255,255,255,0.8)' : '0 1px 2px rgba(0,0,0,0.2)',
                    }}
                />

                {/* Paddle */}
                <div
                    className={`absolute bg-gradient-to-b ${paddleGradient} rounded-t-md`}
                    style={{
                        left: `${scaleX(paddleX)}%`,
                        bottom: `${scaleY(10)}%`,
                        width: `${scaleX(paddleDimensions.width)}%`,
                        height: `${scaleY(paddleDimensions.height)}%`,
                    }}
                />
            </div>

            {/* Game Over / Start Screen Overlay */}
            {(!isRunning || gameOver) && (
                <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-30 backdrop-blur-[1px]">
                    {gameOver ? (
                        <>
                            <div className={`text-2xl font-bold mb-2 ${won ? 'text-green-400' : 'text-red-400'}`}>
                                {won ? 'YOU WIN!' : 'GAME OVER'}
                            </div>
                            <div className="text-white text-sm mb-4">Score: {score}</div>
                            <div className="text-gray-400 text-xs animate-pulse">Press A to Restart</div>
                        </>
                    ) : (
                        <>
                            <div className="text-xl font-bold text-white mb-2">WALL BREAKER</div>
                            <div className="text-gray-400 text-xs animate-pulse">Press A to Start</div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};
