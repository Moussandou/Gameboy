import React from 'react';
import { CalibrationProvider } from '../domain/calibration/CalibrationProvider';
import { ProfileProvider } from '../domain/profile/ProfileProvider';
import { useCalibration } from '../domain/calibration/CalibrationContext';
import { GameboyEmulator } from '../ui/modules/gameboy/GameboyEmulator';
import { LeftSidebar, RightSidebar } from '../ui/components/DesktopSidebar';

const Main: React.FC = () => {
  const { currentSkin } = useCalibration();

  return (
    <div className="flex items-center justify-center w-full h-[100dvh] bg-black md:bg-[#e8e8e8] overflow-hidden relative">
      {/* Desktop Background - Elaborate pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#d4d4d4] to-[#f4f4f4] -z-10" />

      {/* Desktop Layout with Sidebars */}
      <div className="relative z-10 flex items-center justify-center h-full w-full">
        {/* Left Sidebar - Desktop only */}
        <LeftSidebar />

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

        {/* Right Sidebar - Desktop only */}
        <RightSidebar />
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <CalibrationProvider>
      <ProfileProvider>
        <Main />
      </ProfileProvider>
    </CalibrationProvider>
  );
};

export default App;
