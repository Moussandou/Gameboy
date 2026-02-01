import React from 'react';
import { useTetris } from '../../domain/game/useTetris';
import { useSystem } from '../../domain/os/SystemContext';

interface TetrisScreenProps {
    input: Set<string>;
}

export const TetrisScreen: React.FC<TetrisScreenProps> = ({ input }) => {
    const { grid, piece, score, gameOver, isPlaying, COLS, ROWS } = useTetris(input);
    const { theme } = useSystem();
    const isDark = theme === 'dark';

    const bgClass = isDark ? 'bg-[#111]' : 'bg-[#f0f0f0]';
    const gridColor = isDark ? '#333' : '#000';
    const titleColor = isDark ? 'text-blue-400' : 'text-blue-600';

    return (
        <div className={`w-full h-full ${bgClass} flex flex-col items-center justify-center font-jersey relative overflow-hidden transition-colors duration-300`}>
            {/* Background Grid */}
            <div className="absolute inset-0 opacity-5"
                style={{ backgroundImage: `linear-gradient(${gridColor} 1px, transparent 1px), linear-gradient(90deg, ${gridColor} 1px, transparent 1px)`, backgroundSize: '10px 10px' }}
            ></div>

            {/* Score */}
            <div className="absolute top-2 right-2 text-right z-10">
                <div className="text-[8px] text-gray-500 font-bold tracking-widest">SCORE</div>
                <div className={`text-xl leading-none font-bold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>{score}</div>
            </div>

            {/* Game Board */}
            {!isPlaying && !gameOver ? (
                <div className="flex flex-col items-center animate-zoom-in z-20">
                    <h1 className={`text-3xl font-bold ${titleColor} mb-2 drop-shadow-sm tracking-tighter`}>BLOCK STACK</h1>
                    <div className="text-[10px] text-gray-500 animate-pulse text-center">
                        PRESS START<br />TO PLAY
                    </div>
                </div>
            ) : (
                <div className={`relative border-4 ${isDark ? 'border-[#444] bg-[#222]' : 'border-gray-400 bg-white'} rounded p-1 shadow-inner z-10`} style={{ width: '60%', aspectRatio: `${COLS}/${ROWS}` }}>
                    <div className="w-full h-full grid" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)`, gridTemplateRows: `repeat(${ROWS}, 1fr)` }}>
                        {grid.map((row, y) => (
                            row.map((cell, x) => {
                                // Render Grid Cells
                                let cellColor = cell;

                                // Render Active Piece
                                if (x >= piece.x && x < piece.x + piece.shape[0].length &&
                                    y >= piece.y && y < piece.y + piece.shape.length) {
                                    if (piece.shape[y - piece.y][x - piece.x]) {
                                        cellColor = piece.color;
                                    }
                                }

                                return (
                                    <div key={`${x}-${y}`} className={`w-full h-full border-[0.5px] ${isDark ? 'border-[#333]' : 'border-gray-100'} ${cellColor ? 'opacity-100' : 'opacity-0'}`}>
                                        {cellColor && (
                                            <div className={`w-full h-full ${cellColor} bg-current rounded-[1px] shadow-sm`}></div>
                                        )}
                                    </div>
                                );
                            })
                        ))}
                    </div>

                    {gameOver && (
                        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white backdrop-blur-[1px]">
                            <div className="text-2xl font-bold mb-1">GAME OVER</div>
                            <div className="text-xs">SCORE: {score}</div>
                            <div className="text-[8px] mt-2 animate-pulse">PRESS START TO RETRY</div>
                        </div>
                    )}
                </div>
            )}

            {/* Controls Hint */}
            {isPlaying && (
                <div className="absolute bottom-1 left-0 right-0 text-center text-[7px] text-gray-400">
                    A: ROTATE • <span className="font-bold">ARROWS</span>: MOVE
                </div>
            )}
        </div>
    );
};
