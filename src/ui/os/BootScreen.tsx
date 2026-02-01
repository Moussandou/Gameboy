import React, { useEffect, useState } from 'react';

export const BootScreen: React.FC = () => {
    const [showNintendo, setShowNintendo] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setShowNintendo(true), 800);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="w-full h-full bg-[#eeeeee] flex flex-col items-center justify-center font-jersey overflow-hidden relative">

            {/* Background Ambience */}
            <div className="absolute inset-0 bg-gradient-to-b from-white to-[#dddddd] opacity-50 pointer-events-none"></div>

            {/* Main Container for Animation */}
            <div className={`flex flex-col items-center justify-center transition-all duration-1000 transform ${showNintendo ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>

                {/* Logo Icon (Simple Geometric Shape imitating a console logo) */}
                <div className="mb-6 relative">
                    <div className="w-16 h-16 border-4 border-[#555] rounded-full flex items-center justify-center shadow-lg bg-white z-10 relative">
                        <div className="w-8 h-8 bg-[#555] rounded-full"></div>
                    </div>
                    {/* Glow effect behind logo */}
                    <div className="absolute inset-0 bg-blue-400 blur-xl opacity-20 rounded-full scale-150"></div>
                </div>

                {/* Text Logo */}
                <div className="text-4xl text-[#333] font-bold tracking-widest drop-shadow-sm">
                    MOUSSANDOU
                </div>
                <div className="text-sm text-[#888] tracking-[0.5em] mt-2 uppercase font-sans font-semibold">
                    Operating System
                </div>
            </div>

        </div>
    );
};
