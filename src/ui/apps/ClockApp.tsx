import React, { useState, useEffect } from 'react';

export const ClockApp: React.FC = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    };

    return (
        <div className="w-full h-full bg-[#eeeeee] flex flex-col items-center justify-center font-jersey text-gb-screen-darkest relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5"
                style={{
                    backgroundImage: 'radial-gradient(#000 1px, transparent 1px)',
                    backgroundSize: '10px 10px'
                }}
            ></div>

            <div className="z-10 flex flex-col items-center gap-2">
                <div className="text-4xl font-bold tracking-widest text-[#2a2a2a] drop-shadow-sm">
                    {formatTime(time)}
                </div>
                <div className="h-px w-24 bg-gray-400"></div>
                <div className="text-[10px] uppercase tracking-wide text-gray-500 font-bold">
                    {formatDate(time)}
                </div>
            </div>

            <div className="absolute bottom-2 text-[8px] text-gray-400 animate-pulse">
                PRESS SELECT TO EXIT
            </div>
        </div>
    );
};
