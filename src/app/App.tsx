import React from 'react';
import { CalibrationProvider, useCalibration } from '../domain/calibration/CalibrationContext';
import { GameboyEmulator } from '../ui/modules/gameboy/GameboyEmulator';

const Main: React.FC = () => {
  const { currentSkin } = useCalibration();

  return (
    <div className="flex items-center justify-center w-full h-[100dvh] bg-black md:bg-[#e8e8e8] overflow-hidden relative">
      {/* Desktop Background - Elaborate pattern */}
      <div
        className="hidden md:block absolute inset-0 bg-gradient-to-br from-[#f0f0f0] via-[#e8e8e8] to-[#d8d8d8]"
        style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(90, 203, 247, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(147, 197, 253, 0.1) 0%, transparent 50%),
            repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(0,0,0,0.02) 35px, rgba(0,0,0,0.02) 70px)
          `
        }}
      />

      {/* Credits - Desktop only */}
      <div className="hidden md:flex absolute bottom-4 left-0 right-0 justify-center z-20">
        <div className="bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-gray-200">
          <p className="text-gray-600 text-sm font-medium">
            Created by <span className="text-[#5acbf7] font-bold">Moussandou</span> • GameBoy OS Emulator
          </p>
        </div>
      </div>

      {/* Container - Full screen on mobile, constrained on desktop */}
      <div
        className="relative flex items-center justify-center w-full h-full md:h-auto md:w-auto overflow-hidden md:shadow-2xl md:rounded-3xl z-10"
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
