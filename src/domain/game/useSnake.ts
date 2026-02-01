import { useState, useEffect, useCallback, useRef } from 'react';
import { useProfile } from '../profile/ProfileContext';

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
export type Point = { x: number; y: number };

const GRID_W = 20;
const GRID_H = 18;
const INITIAL_SPEED = 150;

export const useSnake = (input: Set<string>) => {
    const { submitScore } = useProfile();
    const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
    const [food, setFood] = useState<Point>({ x: 5, y: 5 });
    const [direction, setDirection] = useState<Direction>('RIGHT');
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [isRunning, setIsRunning] = useState(false);

    // Use refs for values accessed in interval to avoid closure staleness issues
    const directionRef = useRef(direction);
    const snakeRef = useRef(snake);
    const gameOverRef = useRef(gameOver);
    const isRunningRef = useRef(isRunning);
    const scoreRef = useRef(score);

    useEffect(() => {
        directionRef.current = direction;
        snakeRef.current = snake;
        gameOverRef.current = gameOver;
        isRunningRef.current = isRunning;
        scoreRef.current = score;
    }, [direction, snake, gameOver, isRunning, score]);

    const randomFood = useCallback((): Point => {
        return {
            x: Math.floor(Math.random() * GRID_W),
            y: Math.floor(Math.random() * GRID_H),
        };
    }, []);

    const resetGame = useCallback(() => {
        setSnake([{ x: 10, y: 10 }]);
        setFood(randomFood());
        setDirection('RIGHT');
        setGameOver(false);
        setScore(0);
        setIsRunning(true);
    }, [randomFood]);

    // Input Handling
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (input.has('UP') && directionRef.current !== 'DOWN') setDirection('UP');
            if (input.has('DOWN') && directionRef.current !== 'UP') setDirection('DOWN');
            if (input.has('LEFT') && directionRef.current !== 'RIGHT') setDirection('LEFT');
            if (input.has('RIGHT') && directionRef.current !== 'LEFT') setDirection('RIGHT');

            if (input.has('START') || input.has('A')) {
                if (gameOverRef.current) resetGame();
                else if (!isRunningRef.current) setIsRunning(true);
            }
        }, 0);
        return () => clearTimeout(timeout);
    }, [input, resetGame]);

    const moveSnake = useCallback(() => {
        if (gameOverRef.current || !isRunningRef.current) return;

        const head = { ...snakeRef.current[0] };

        switch (directionRef.current) {
            case 'UP': head.y -= 1; break;
            case 'DOWN': head.y += 1; break;
            case 'LEFT': head.x -= 1; break;
            case 'RIGHT': head.x += 1; break;
        }

        // Wall Collision
        if (head.x < 0 || head.x >= GRID_W || head.y < 0 || head.y >= GRID_H) {
            setGameOver(true);
            setIsRunning(false);
            submitScore('snake', scoreRef.current);
            return;
        }

        // Self Collision
        if (snakeRef.current.some(p => p.x === head.x && p.y === head.y)) {
            setGameOver(true);
            setIsRunning(false);
            submitScore('snake', scoreRef.current);
            return;
        }

        const newSnake = [head, ...snakeRef.current];

        // Eat Food
        if (head.x === food.x && head.y === food.y) {
            setScore(s => s + 10);
            setFood(randomFood());
        } else {
            newSnake.pop();
        }

        setSnake(newSnake);
    }, [food, randomFood]);

    useEffect(() => {
        const interval = setInterval(moveSnake, INITIAL_SPEED);
        return () => clearInterval(interval);
    }, [moveSnake]);

    return { snake, food, gameOver, score, isRunning, grid: { w: GRID_W, h: GRID_H } };
};
