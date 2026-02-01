export type ElementType = 'SCREEN' | 'A' | 'B' | 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | 'START' | 'SELECT';

export interface Rect {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface CalibrationData {
    [key: string]: Rect;
}

export interface CalibrationState {
    data: CalibrationData;
    isCalibrated: boolean;
    currentSkin: string;
    saveCalibration: (data: CalibrationData) => void;
    resetCalibration: () => void;
    setSkin: (skin: string) => void;
}
