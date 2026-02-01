import React from 'react';

export const CreditsApp: React.FC<{ input?: Set<string> }> = () => {
    return (
        <div className="w-full h-full bg-[#eeeeee] flex flex-col font-jersey text-gb-screen-darkest relative overflow-hidden">
            {/* Header */}
            <div className="h-10 bg-white border-b border-gray-300 flex items-center justify-center shadow-sm z-10 shrink-0">
                <span className="text-lg text-gray-600 font-bold tracking-widest bg-white z-10 px-4">CREDITS</span>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                {/* Logo */}
                <div className="w-20 h-20 bg-white border-4 border-[#555] rounded-2xl flex items-center justify-center shadow-lg mb-6">
                    <div className="grid grid-cols-2 gap-1.5 p-3">
                        <div className="w-4 h-4 bg-[#555] rounded-[2px]"></div>
                        <div className="w-4 h-4 bg-[#555] rounded-[2px]"></div>
                        <div className="w-4 h-4 bg-[#555] rounded-[2px]"></div>
                        <div className="w-4 h-4 bg-[#555] rounded-[2px]"></div>
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-2xl text-[#333] font-bold tracking-widest mb-2">
                    MOUSSANDOU OS
                </h1>
                <p className="text-sm text-gray-500 mb-8">GameBoy Advance SP Emulator</p>

                {/* Credits */}
                <div className="bg-white rounded-xl p-4 shadow-md border border-gray-200 w-full max-w-[200px]">
                    <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Created by</p>
                    <p className="text-[#5acbf7] font-bold text-lg">Moussandou</p>
                </div>

                {/* Version */}
                <div className="mt-8 text-gray-400 text-xs">
                    <p>Version 1.0.0</p>
                    <p className="mt-1">© 2026 All Rights Reserved</p>
                </div>
            </div>

            {/* Hint */}
            <div className="pb-4 text-center text-[10px] text-gray-400 tracking-wider shrink-0">
                SELECT to Exit
            </div>
        </div>
    );
};
