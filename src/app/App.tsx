import React from 'react';
import { CalibrationProvider, useCalibration } from '../domain/calibration/CalibrationContext';
import { GameboyEmulator } from '../ui/modules/gameboy/GameboyEmulator';

const Main: React.FC = () => {
  const { currentSkin } = useCalibration();

  return (
    <div className="flex items-center justify-center w-full h-[100dvh] bg-black md:bg-neutral-900 md:p-8 overflow-hidden">
      <div className="relative flex items-center justify-center w-full h-full md:w-auto md:h-auto md:shadow-2xl md:rounded-3xl overflow-hidden">
        {/* Background Image - drives dimensions */}
        <img
          src={currentSkin}
          alt="GameBoy Background"
          className="block w-full h-full select-none pointer-events-none touch-none"
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
