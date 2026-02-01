import React from 'react';
import { CalibrationProvider, useCalibration } from '../domain/calibration/CalibrationContext';
import { GameboyEmulator } from '../ui/modules/gameboy/GameboyEmulator';

const Main: React.FC = () => {
  const { currentSkin } = useCalibration();

  return (
    <div className="flex items-center justify-center w-full h-[100dvh] bg-black md:bg-neutral-900 overflow-hidden">
      {/* Container - Full screen on mobile, constrained on desktop */}
      <div
        className="relative flex items-center justify-center w-full h-full md:h-auto md:w-auto overflow-hidden md:shadow-2xl md:rounded-3xl"
        style={{ maxHeight: '100vh' }}
      >
        {/* Background Image - drives dimensions */}
        <img
          src={currentSkin}
          alt="GameBoy Background"
          className="block w-full h-full md:w-auto md:h-[90vh] md:max-h-[900px] select-none pointer-events-none touch-none md:object-contain"
          style={{ objectFit: 'fill' }}
        />

        {/* GameBoy Emulator - Always shown (auto-calibrated) */}
        <div className="absolute inset-0">
          <GameboyEmulator />
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <CalibrationProvider>
      <Main />
    </CalibrationProvider>
  );
};

export default App;
