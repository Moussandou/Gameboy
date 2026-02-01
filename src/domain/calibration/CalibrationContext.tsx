import React, { createContext, useContext, useEffect, useState } from 'react';
import type { CalibrationData, CalibrationState } from './types';


import { DEFAULT_CALIBRATION } from './defaultConfig';

const STORAGE_KEY = 'gb_calibration_v2';

const defaultState: CalibrationState = {
    data: {},
    isCalibrated: false,
    saveCalibration: () => { },
    resetCalibration: () => { },
};

const CalibrationContext = createContext<CalibrationState>(defaultState);

export const CalibrationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [data, setData] = useState<CalibrationData>({});
    const [isCalibrated, setIsCalibrated] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                if (Object.keys(parsed).length > 0) {
                    setData(parsed);
                    setIsCalibrated(true);
                    return;
                }
            } catch (e) {
                console.error('Failed to parse calibration data', e);
            }
        }

        // Fallback to default config if valid
        if (Object.keys(DEFAULT_CALIBRATION).length > 0) {
            setData(DEFAULT_CALIBRATION);
            setIsCalibrated(true);
        }
    }, []);

    const saveCalibration = (newData: CalibrationData) => {
        setData(newData);
        setIsCalibrated(true);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    };

    const resetCalibration = () => {
        setData({});
        setIsCalibrated(false);
        localStorage.removeItem(STORAGE_KEY);
    };

    return (
        <CalibrationContext.Provider value={{ data, isCalibrated, saveCalibration, resetCalibration }}>
            {children}
        </CalibrationContext.Provider>
    );
};

export const useCalibration = () => useContext(CalibrationContext);
