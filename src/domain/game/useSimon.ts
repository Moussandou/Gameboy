import { useState, useEffect, useCallback, useRef } from 'react';
import { useProfile } from '../profile/ProfileContext';

export type SimonDirection = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

interface SimonState {
    sequence: SimonDirection[];
    playerIndex: number;
    isShowingSequence: boolean;
    currentShowIndex: number;
    activeButton: SimonDirection | null;
    score: number;
    gameOver: boolean;
    isRunning: boolean;
    playerTurn: boolean;
}

const DIRECTIONS: SimonDirection[] = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
const SHOW_DELAY = 500; // ms between each sequence item
const FLASH_DURATION = 350; // ms for button flash

export const useSimon = (input: Set<string>): SimonState => {
    const { submitScore } = useProfile();
    const [sequence, setSequence] = useState<SimonDirection[]>([]);
    const [playerIndex, setPlayerIndex] = useState(0);
    const [isShowingSequence, setIsShowingSequence] = useState(false);
    const [currentShowIndex, setCurrentShowIndex] = useState(0);
    const [activeButton, setActiveButton] = useState<SimonDirection | null>(null);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [isRunning, setIsRunning] = useState(false);
    const [playerTurn, setPlayerTurn] = useState(false);

    const prevInput = useRef<Set<string>>(new Set());
    const gameOverRef = useRef(gameOver);
    const isRunningRef = useRef(isRunning);

    useEffect(() => {
        gameOverRef.current = gameOver;
        isRunningRef.current = isRunning;
    }, [gameOver, isRunning]);

    const addToSequence = useCallback(() => {
        const newDirection = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
        setSequence(prev => [...prev, newDirection]);
    }, []);

    const startGame = useCallback(() => {
        setSequence([]);
        setPlayerIndex(0);
        setScore(0);
        setGameOver(false);
        setIsRunning(true);
        setPlayerTurn(false);
        setIsShowingSequence(false);
        // Add first item after a short delay
        setTimeout(() => {
            const firstDirection = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
            setSequence([firstDirection]);
        }, 500);
    }, []);

    // Show Sequence Effect
    useEffect(() => {
        if (!isRunning || gameOver || sequence.length === 0) return;
        if (playerTurn) return; // Don't show while player is inputting

        setIsShowingSequence(true);
        setCurrentShowIndex(0);

        let index = 0;
        const showNext = () => {
            if (index < sequence.length) {
                setActiveButton(sequence[index]);
                setCurrentShowIndex(index);
                setTimeout(() => {
                    setActiveButton(null);
                    index++;
                    setTimeout(showNext, SHOW_DELAY - FLASH_DURATION);
                }, FLASH_DURATION);
            } else {
                setIsShowingSequence(false);
                setPlayerTurn(true);
                setPlayerIndex(0);
            }
        };

        const startTimeout = setTimeout(showNext, 500);
        return () => clearTimeout(startTimeout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sequence, isRunning, gameOver]); // Trigger ONLY when sequence changes (not when turn changes)

    // Player Input Handling
    useEffect(() => {
        if (!isRunning || gameOver || isShowingSequence || !playerTurn) return;

        const isJustPressed = (btn: string) => input.has(btn) && !prevInput.current.has(btn);

        for (const dir of DIRECTIONS) {
            if (isJustPressed(dir)) {
                setActiveButton(dir);
                setTimeout(() => setActiveButton(null), 200);

                if (sequence[playerIndex] === dir) {
                    // Correct!
                    if (playerIndex === sequence.length - 1) {
                        // Completed sequence
                        setScore(s => s + 1);
                        setPlayerTurn(false);
                        setPlayerIndex(0);
                        // Add next item after delay
                        setTimeout(addToSequence, 1000);
                    } else {
                        setPlayerIndex(i => i + 1);
                    }
                } else {
                    // Wrong!
                    setGameOver(true);
                    setIsRunning(false);
                    submitScore('simon', score);
                }
                break;
            }
        }

        prevInput.current = new Set(input);
    }, [input, isRunning, gameOver, isShowingSequence, playerTurn, sequence, playerIndex, addToSequence, score, submitScore]);

    // Start/Restart Input
    useEffect(() => {
        const isJustPressed = (btn: string) => input.has(btn) && !prevInput.current.has(btn);

        if (isJustPressed('A') || isJustPressed('START')) {
            if (gameOverRef.current || !isRunningRef.current) {
                startGame();
            }
        }

        prevInput.current = new Set(input);
    }, [input, startGame]);

    return {
        sequence,
        playerIndex,
        isShowingSequence,
        currentShowIndex,
        activeButton,
        score,
        gameOver,
        isRunning,
        playerTurn,
    };
};
