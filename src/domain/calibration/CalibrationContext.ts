import { createContext, useContext } from 'react';
import type { CalibrationState } from './types';
import { AVAILABLE_SKINS } from './constants';

const defaultState: CalibrationState = {
    data: {},
    isCalibrated: false,
    currentSkin: AVAILABLE_SKINS[0].path,
    saveCalibration: () => { },
    resetCalibration: () => { },
    setSkin: () => { },
};

export const CalibrationContext = createContext<CalibrationState>(defaultState);
export const useCalibration = () => useContext(CalibrationContext);
