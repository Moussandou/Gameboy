import type { CalibrationData, Rect } from '../calibration/types';

export const isPointInRect = (x: number, y: number, rect: Rect): boolean => {
    return (
        x >= rect.x &&
        x <= rect.x + rect.width &&
        y >= rect.y &&
        y <= rect.y + rect.height
    );
};

export const getPressedButton = (
    x: number,
    y: number,
    calibration: CalibrationData
): string | null => {
    for (const [key, rect] of Object.entries(calibration)) {
        if (key === 'SCREEN') continue; // Screen is handled separately usually, or maybe not
        if (isPointInRect(x, y, rect)) {
            return key;
        }
    }
    return null;
};
