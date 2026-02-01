import { useState, useEffect, useRef, useCallback } from 'react';
import { useProfile } from '../profile/ProfileContext';

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
    const { submitScore } = useProfile();
    const [grid, setGrid] = useState<string[][]>(Array(ROWS).fill(Array(COLS).fill(null)));
    const [piece, setPiece] = useState(randomTetromino());
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    // Track input for discrete moves (prevent flying)
    const lastInputStep = useRef<number>(0);
    // Track previous input for edge detection
    const prevInput = useRef<Set<string>>(new Set());

    const checkCollision = useCallback((p: typeof piece, g: string[][]) => {
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
    }, []);

    const rotate = useCallback((p: typeof piece) => {
        const rotatedShape = p.shape[0].map((_, index) => p.shape.map(row => row[index]).reverse());
        return { ...p, shape: rotatedShape };
    }, []);

    const placePiece = useCallback(() => {
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

        const newScore = score + (cleared * 100);
        setScore(newScore);
        setGrid(newGrid);

        // Spawn new
        const newPiece = randomTetromino();
        if (checkCollision(newPiece, newGrid)) {
            setGameOver(true);
            setIsPlaying(false);
            submitScore('tetris', newScore);
        } else {
            setPiece(newPiece);
        }
    }, [grid, piece, checkCollision, score, submitScore]);

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
    }, [isPlaying, gameOver, piece, grid, checkCollision, placePiece]);

    // Input Handling
    useEffect(() => {
        const isJustPressed = (btn: string) => input.has(btn) && !prevInput.current.has(btn);
        const isHeld = (btn: string) => input.has(btn);

        if (!isPlaying || gameOver) {
            if (isJustPressed('START') || isJustPressed('A')) {
                // Wrap in timeout to avoid synchronous set-state-in-effect warning
                setTimeout(() => {
                    setGrid(Array(ROWS).fill(Array(COLS).fill(null)));
                    setPiece(randomTetromino());
                    setScore(0);
                    setGameOver(false);
                    setIsPlaying(true);
                }, 0);
            }
            prevInput.current = new Set(input);
            return;
        }

        // Action Buttons (Edge Triggered)
        let moved = false;

        if (isJustPressed('A')) {
            // Rotate
            const next = rotate(piece);
            if (!checkCollision(next, grid)) {
                setTimeout(() => setPiece(next), 0);
                moved = true;
            }
        }

        // D-Pad (Continuous with limit)
        const now = Date.now();
        // Allow movement every 100ms
        if (now - lastInputStep.current >= 100) {
            if (isHeld('LEFT')) {
                const next = { ...piece, x: piece.x - 1 };
                if (!checkCollision(next, grid)) {
                    setPiece(next);
                    moved = true;
                }
            } else if (isHeld('RIGHT')) {
                const next = { ...piece, x: piece.x + 1 };
                if (!checkCollision(next, grid)) {
                    setPiece(next);
                    moved = true;
                }
            } else if (isHeld('DOWN')) {
                const next = { ...piece, y: piece.y + 1 };
                if (!checkCollision(next, grid)) {
                    setPiece(next);
                    moved = true;
                }
            }
            if (moved) lastInputStep.current = now;
        }

        prevInput.current = new Set(input); // Update logic
    }, [input, piece, grid, isPlaying, gameOver, checkCollision, rotate]);

    return { grid, piece, score, gameOver, isPlaying, COLS, ROWS };
};
