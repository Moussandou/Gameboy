import React, { useState, useEffect } from 'react';
import type { CalibrationData } from './types';
import { DEFAULT_CALIBRATION } from './defaultConfig';
import { AVAILABLE_SKINS, SKIN_STORAGE_KEY, STORAGE_KEY } from './constants';
import { CalibrationContext } from './CalibrationContext';

export const CalibrationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Auto-calibration: Always use default config (works on all screen sizes as values are percentages)
    const [data, setData] = useState<CalibrationData>(DEFAULT_CALIBRATION);
    const [isCalibrated, setIsCalibrated] = useState(true);
    const [currentSkin, setCurrentSkin] = useState<string>(AVAILABLE_SKINS[0].path);

    useEffect(() => {
        // Load Skin preference only (calibration is automatic)
        const storedSkin = localStorage.getItem(SKIN_STORAGE_KEY);
        if (storedSkin) {
            const timeout = setTimeout(() => {
                setCurrentSkin(storedSkin);
            }, 0);
            return () => clearTimeout(timeout);
        }
    }, []);

    const saveCalibration = (newData: CalibrationData) => {
        setData(newData);
        setIsCalibrated(true);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    };

    const resetCalibration = () => {
        setData(DEFAULT_CALIBRATION);
        setIsCalibrated(false);
        localStorage.removeItem(STORAGE_KEY);
    };

    const setSkin = (skinPath: string) => {
        setCurrentSkin(skinPath);
        localStorage.setItem(SKIN_STORAGE_KEY, skinPath);
    };

    return (
        <CalibrationContext.Provider value={{ data, isCalibrated, currentSkin, saveCalibration, resetCalibration, setSkin }}>
            {children}
        </CalibrationContext.Provider>
    );
};

