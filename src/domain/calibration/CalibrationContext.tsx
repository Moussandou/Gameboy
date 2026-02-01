import React, { createContext, useContext, useEffect, useState } from 'react';
import type { CalibrationData, CalibrationState } from './types';


import { DEFAULT_CALIBRATION } from './defaultConfig';



export const AVAILABLE_SKINS = [
    { id: 'original', name: 'Original', path: '/gb_bg.jpg' },
    { id: 'pikachu', name: 'Pikachu', path: '/skins/pikachu.jpg' },
    { id: 'lugia', name: 'Lugia', path: '/skins/lugia.jpg' },
    { id: 'stickers', name: 'Stickers', path: '/skins/stickers.jpg' },
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
    const [data, setData] = useState<CalibrationData>({});
    const [isCalibrated, setIsCalibrated] = useState(false);
    const [currentSkin, setCurrentSkin] = useState<string>(AVAILABLE_SKINS[0].path);

    useEffect(() => {
        // Load Calibration
        const storedCalib = localStorage.getItem(STORAGE_KEY);
        if (storedCalib) {
            try {
                const parsed = JSON.parse(storedCalib);
                if (Object.keys(parsed).length > 0) {
                    setData(parsed);
                    setIsCalibrated(true);
                }
            } catch (e) {
                console.error('Failed to parse calibration data', e);
            }
        } else if (Object.keys(DEFAULT_CALIBRATION).length > 0) {
            setData(DEFAULT_CALIBRATION);
            setIsCalibrated(true);
        }

        // Load Skin
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

