import { useState, useEffect, useCallback, useRef } from 'react';
import { useProfile } from '../profile/ProfileContext';

// Constants
const GAME_WIDTH = 160;
const GAME_HEIGHT = 144;
const PADDLE_WIDTH = 30;
const PADDLE_HEIGHT = 6;
const PADDLE_SPEED = 4;
const BALL_SIZE = 4;
const BRICK_ROWS = 4;
const BRICK_COLS = 8;
const BRICK_WIDTH = GAME_WIDTH / BRICK_COLS;
const BRICK_HEIGHT = 8;
const INITIAL_BALL_SPEED = 2;

export interface Brick {
    x: number;
    y: number;
    alive: boolean;
    color: string;
}

export interface BreakoutState {
    paddleX: number;
    ballX: number;
    ballY: number;
    ballVX: number;
    ballVY: number;
    bricks: Brick[];
    score: number;
    lives: number;
    gameOver: boolean;
    won: boolean;
    isRunning: boolean;
    dimensions: { width: number; height: number };
    paddleDimensions: { width: number; height: number };
    ballSize: number;
    brickDimensions: { width: number; height: number };
}

const BRICK_COLORS = ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF'];

const createBricks = (): Brick[] => {
    const bricks: Brick[] = [];
    for (let row = 0; row < BRICK_ROWS; row++) {
        for (let col = 0; col < BRICK_COLS; col++) {
            bricks.push({
                x: col * BRICK_WIDTH,
                y: row * BRICK_HEIGHT + 20, // Offset from top
                alive: true,
                color: BRICK_COLORS[row % BRICK_COLORS.length],
            });
        }
    }
    return bricks;
};

export const useBreakout = (input: Set<string>): BreakoutState => {
    const { submitScore } = useProfile();
    const [paddleX, setPaddleX] = useState((GAME_WIDTH - PADDLE_WIDTH) / 2);
    const [ballX, setBallX] = useState(GAME_WIDTH / 2);
    const [ballY, setBallY] = useState(GAME_HEIGHT - 30);
    const [ballVX, setBallVX] = useState(INITIAL_BALL_SPEED);
    const [ballVY, setBallVY] = useState(-INITIAL_BALL_SPEED);
    const [bricks, setBricks] = useState<Brick[]>(createBricks);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [gameOver, setGameOver] = useState(false);
    const [won, setWon] = useState(false);
    const [isRunning, setIsRunning] = useState(false);

    // Refs for interval access
    const paddleXRef = useRef(paddleX);
    const ballXRef = useRef(ballX);
    const ballYRef = useRef(ballY);
    const ballVXRef = useRef(ballVX);
    const ballVYRef = useRef(ballVY);
    const bricksRef = useRef(bricks);
    const livesRef = useRef(lives);
    const gameOverRef = useRef(gameOver);
    const isRunningRef = useRef(isRunning);

    useEffect(() => {
        paddleXRef.current = paddleX;
        ballXRef.current = ballX;
        ballYRef.current = ballY;
        ballVXRef.current = ballVX;
        ballVYRef.current = ballVY;
        bricksRef.current = bricks;
        livesRef.current = lives;
        gameOverRef.current = gameOver;
        isRunningRef.current = isRunning;
    }, [paddleX, ballX, ballY, ballVX, ballVY, bricks, lives, gameOver, isRunning]);

    const resetBall = useCallback(() => {
        setBallX(GAME_WIDTH / 2);
        setBallY(GAME_HEIGHT - 30);
        setBallVX(INITIAL_BALL_SPEED * (Math.random() > 0.5 ? 1 : -1));
        setBallVY(-INITIAL_BALL_SPEED);
    }, []);

    const resetGame = useCallback(() => {
        setPaddleX((GAME_WIDTH - PADDLE_WIDTH) / 2);
        resetBall();
        setBricks(createBricks());
        setScore(0);
        setLives(3);
        setGameOver(false);
        setWon(false);
        setIsRunning(true);
    }, [resetBall]);

    // Input Handling
    useEffect(() => {
        if (gameOverRef.current || !isRunningRef.current) {
            if (input.has('A') || input.has('START')) {
                const timeout = setTimeout(() => {
                    if (gameOverRef.current) {
                        resetGame();
                    } else {
                        setIsRunning(true);
                    }
                }, 0);
                return () => clearTimeout(timeout);
            }
            return;
        }

        const timeout = setTimeout(() => {
            if (input.has('LEFT')) {
                setPaddleX(prev => Math.max(0, prev - PADDLE_SPEED));
            }
            if (input.has('RIGHT')) {
                setPaddleX(prev => Math.min(GAME_WIDTH - PADDLE_WIDTH, prev + PADDLE_SPEED));
            }
        }, 0);
        return () => clearTimeout(timeout);
    }, [input, resetGame]);

    // Game Loop
    const gameLoop = useCallback(() => {
        if (gameOverRef.current || !isRunningRef.current) return;

        let newBallX = ballXRef.current + ballVXRef.current;
        let newBallY = ballYRef.current + ballVYRef.current;
        let newVX = ballVXRef.current;
        let newVY = ballVYRef.current;

        // Wall Collisions (Left/Right)
        if (newBallX <= 0 || newBallX >= GAME_WIDTH - BALL_SIZE) {
            newVX = -newVX;
            newBallX = Math.max(0, Math.min(GAME_WIDTH - BALL_SIZE, newBallX));
        }

        // Top Wall
        if (newBallY <= 0) {
            newVY = -newVY;
            newBallY = 0;
        }

        // Paddle Collision
        const paddleTop = GAME_HEIGHT - PADDLE_HEIGHT - 10;
        if (
            newBallY + BALL_SIZE >= paddleTop &&
            newBallY <= paddleTop + PADDLE_HEIGHT &&
            newBallX + BALL_SIZE >= paddleXRef.current &&
            newBallX <= paddleXRef.current + PADDLE_WIDTH
        ) {
            newVY = -Math.abs(newVY); // Always go up
            // Add spin based on where it hit the paddle
            const hitPos = (newBallX - paddleXRef.current) / PADDLE_WIDTH;
            newVX = (hitPos - 0.5) * 4;
            newBallY = paddleTop - BALL_SIZE;
        }

        // Bottom (Lose Life)
        if (newBallY >= GAME_HEIGHT) {
            const newLives = livesRef.current - 1;
            setLives(newLives);
            if (newLives <= 0) {
                setGameOver(true);
                setIsRunning(false);
                submitScore('breakout', score);
            } else {
                resetBall();
            }
            return;
        }

        // Brick Collisions
        let hitBrick = false;
        const updatedBricks = bricksRef.current.map(brick => {
            if (!brick.alive) return brick;

            if (
                newBallX + BALL_SIZE >= brick.x &&
                newBallX <= brick.x + BRICK_WIDTH &&
                newBallY + BALL_SIZE >= brick.y &&
                newBallY <= brick.y + BRICK_HEIGHT
            ) {
                if (!hitBrick) {
                    newVY = -newVY;
                    hitBrick = true;
                }
                setScore(s => s + 10);
                return { ...brick, alive: false };
            }
            return brick;
        });

        if (hitBrick) {
            setBricks(updatedBricks);
            // Check Win
            if (updatedBricks.every(b => !b.alive)) {
                setWon(true);
                setGameOver(true);
                setIsRunning(false);
                submitScore('breakout', score + 10);
            }
        }

        setBallX(newBallX);
        setBallY(newBallY);
        setBallVX(newVX);
        setBallVY(newVY);
    }, [resetBall, score, submitScore]);

    useEffect(() => {
        const interval = setInterval(gameLoop, 16); // ~60fps
        return () => clearInterval(interval);
    }, [gameLoop]);

    return {
        paddleX,
        ballX,
        ballY,
        ballVX,
        ballVY,
        bricks,
        score,
        lives,
        gameOver,
        won,
        isRunning,
        dimensions: { width: GAME_WIDTH, height: GAME_HEIGHT },
        paddleDimensions: { width: PADDLE_WIDTH, height: PADDLE_HEIGHT },
        ballSize: BALL_SIZE,
        brickDimensions: { width: BRICK_WIDTH, height: BRICK_HEIGHT },
    };
};
