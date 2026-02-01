import { useState, useEffect, useCallback, useRef } from 'react';

const COLS = 10;
const ROWS = 18; // Slightly shorter for GameBoy screen aspect

const TETROMINOES = {
    I: { shape: [[1, 1, 1, 1]], color: 'text-cyan-400' },
    J: { shape: [[1, 0, 0], [1, 1, 1]], color: 'text-blue-500' },
    L: { shape: [[0, 0, 1], [1, 1, 1]], color: 'text-orange-500' },
    O: { shape: [[1, 1], [1, 1]], color: 'text-yellow-400' },
    S: { shape: [[0, 1, 1], [1, 1, 0]], color: 'text-green-500' },
    T: { shape: [[0, 1, 0], [1, 1, 1]], color: 'text-purple-500' },
    Z: { shape: [[1, 1, 0], [0, 1, 1]], color: 'text-red-500' }
};

type TetrominoType = keyof typeof TETROMINOES;

const randomTetromino = () => {
    const keys = Object.keys(TETROMINOES) as TetrominoType[];
    const rand = keys[Math.floor(Math.random() * keys.length)];
    return {
        type: rand,
        shape: TETROMINOES[rand].shape,
        color: TETROMINOES[rand].color,
        x: Math.floor(COLS / 2) - Math.ceil(TETROMINOES[rand].shape[0].length / 2),
        y: 0
    };
};

export const useTetris = (input: Set<string>) => {
    const [grid, setGrid] = useState<string[][]>(Array(ROWS).fill(Array(COLS).fill(null)));
    const [piece, setPiece] = useState(randomTetromino());
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    // Track input for discrete moves (prevent flying)
    const lastInputStep = useRef<number>(0);
    const moveInterval = useRef<NodeJS.Timeout | null>(null);

    const checkCollision = (p: typeof piece, g: string[][]) => {
        for (let y = 0; y < p.shape.length; y++) {
            for (let x = 0; x < p.shape[y].length; x++) {
                if (p.shape[y][x]) {
                    const newX = p.x + x;
                    const newY = p.y + y;
                    if (newX < 0 || newX >= COLS || newY >= ROWS || (newY >= 0 && g[newY][newX])) {
                        return true;
                    }
                }
            }
        }
        return false;
    };

    const rotate = (p: typeof piece) => {
        const rotatedShape = p.shape[0].map((_, index) => p.shape.map(row => row[index]).reverse());
        return { ...p, shape: rotatedShape };
    };

    const placePiece = () => {
        const newGrid = grid.map(row => [...row]);
        piece.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value) {
                    if (piece.y + y >= 0 && piece.y + y < ROWS) {
                        newGrid[piece.y + y][piece.x + x] = piece.color;
                    }
                }
            });
        });

        // Check clear lines
        let cleared = 0;
        for (let y = ROWS - 1; y >= 0; y--) {
            if (newGrid[y].every(cell => cell !== null)) {
                newGrid.splice(y, 1);
                newGrid.unshift(Array(COLS).fill(null));
                cleared++;
                y++; // Recheck same row (it's new now)
            }
        }

        setScore(prev => prev + (cleared * 100));
        setGrid(newGrid);

        // Spawn new
        const newPiece = randomTetromino();
        if (checkCollision(newPiece, newGrid)) {
            setGameOver(true);
            setIsPlaying(false);
        } else {
            setPiece(newPiece);
        }
    };

    // Game Loop
    useEffect(() => {
        if (!isPlaying || gameOver) return;

        const loop = setInterval(() => {
            const nextPiece = { ...piece, y: piece.y + 1 };
            if (checkCollision(nextPiece, grid)) {
                placePiece();
            } else {
                setPiece(nextPiece);
            }
        }, 500); // Drop speed

        return () => clearInterval(loop);
    }, [isPlaying, gameOver, piece, grid]);

    // Input Handling
    useEffect(() => {
        if (!isPlaying || gameOver) {
            if (input.has('START')) {
                setGrid(Array(ROWS).fill(Array(COLS).fill(null)));
                setPiece(randomTetromino());
                setScore(0);
                setGameOver(false);
                setIsPlaying(true);
            }
            return;
        }

        // Discrete movements
        const now = Date.now();
        if (now - lastInputStep.current < 100) return; // Input debounce for movement

        let moved = false;

        if (input.has('LEFT')) {
            const next = { ...piece, x: piece.x - 1 };
            if (!checkCollision(next, grid)) {
                setPiece(next);
                moved = true;
            }
        } else if (input.has('RIGHT')) {
            const next = { ...piece, x: piece.x + 1 };
            if (!checkCollision(next, grid)) {
                setPiece(next);
                moved = true;
            }
        } else if (input.has('DOWN')) {
            const next = { ...piece, y: piece.y + 1 };
            if (!checkCollision(next, grid)) {
                setPiece(next);
                moved = true;
            }
        } else if (input.has('A')) {
            // Rotate
            const next = rotate(piece);
            if (!checkCollision(next, grid)) {
                setPiece(next);
                moved = true;
            }
        }

        if (moved) lastInputStep.current = now;

    }, [input, piece, grid, isPlaying, gameOver]);

    return { grid, piece, score, gameOver, isPlaying, COLS, ROWS };
};
