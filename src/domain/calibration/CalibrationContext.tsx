import React, { createContext, useContext, useEffect, useState } from 'react';
import type { CalibrationData, CalibrationState } from './types';


import { DEFAULT_CALIBRATION } from './defaultConfig';



export const AVAILABLE_SKINS = [
    { id: 'original', name: 'Original', path: '/gb_bg.jpg' },
    { id: 'pikachu', name: 'Pikachu', path: '/skins/pikachu.jpg' },
    { id: 'lugia', name: 'Lugia', path: '/skins/lugia.jpg' },
    { id: 'mew', name: 'Mew', path: '/skins/mew.jpg' },
];

const STORAGE_KEY = 'gb_calibration_v2';
const SKIN_STORAGE_KEY = 'gb_skin_pref';

const defaultState: CalibrationState = {
    data: {},
    isCalibrated: false,
    currentSkin: AVAILABLE_SKINS[0].path,
    saveCalibration: () => { },
    resetCalibration: () => { },
    setSkin: () => { },
};

const CalibrationContext = createContext<CalibrationState>(defaultState);

export const CalibrationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Auto-calibration: Always use default config (works on all screen sizes as values are percentages)
    const [data, setData] = useState<CalibrationData>(DEFAULT_CALIBRATION);
    const [isCalibrated, setIsCalibrated] = useState(true);
    const [currentSkin, setCurrentSkin] = useState<string>(AVAILABLE_SKINS[0].path);

    useEffect(() => {
        // Load Skin preference only (calibration is automatic)
        const storedSkin = localStorage.getItem(SKIN_STORAGE_KEY);
        if (storedSkin) {
            setCurrentSkin(storedSkin);
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

export const useCalibration = () => useContext(CalibrationContext);

