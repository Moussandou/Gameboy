import React from 'react';
import { CalibrationProvider } from '../domain/calibration/CalibrationProvider';
import { ProfileProvider } from '../domain/profile/ProfileProvider';
import { useCalibration } from '../domain/calibration/CalibrationContext';
import { GameboyEmulator } from '../ui/modules/gameboy/GameboyEmulator';
import { LeftSidebar, RightSidebar } from '../ui/components/DesktopSidebar';

const Main: React.FC = () => {
  const { currentSkin } = useCalibration();

  return (
    <div className="flex items-center justify-center w-full h-[100dvh] bg-black md:bg-transparent overflow-hidden relative">
      {/* Desktop Background - Wii Style Pattern */}
      <div className="absolute inset-0 bg-[#dcdcdc] -z-30 hidden md:block" />
      <div
        className="absolute inset-0 opacity-[0.4] -z-20 hidden md:block"
        style={{
          backgroundImage: 'repeating-linear-gradient(-45deg, transparent, transparent 4px, rgba(255,255,255,1) 4px, rgba(255,255,255,1) 6px)'
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-black/5 via-transparent to-black/20 -z-10 hidden md:block" />
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-black/5 -z-10" />

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
