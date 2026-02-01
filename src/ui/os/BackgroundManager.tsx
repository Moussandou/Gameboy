import React from 'react';
import { useSystem } from '../../domain/os/SystemContext';

export const BackgroundManager: React.FC<{ className?: string }> = ({ className = "fixed inset-0 -z-30" }) => {
    const { wallpaper } = useSystem();

    // Base background layer
    const renderBackground = () => {
        switch (wallpaper) {
            case 'particles':
                return (
                    <div className="absolute inset-0 bg-[#0f0c29] overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] opacity-90"></div>
                        <div className="particles-container absolute inset-0 opacity-40">
                            {/* Simple CSS-based particles/stars */}
                            {[...Array(20)].map((_, i) => (
                                <div key={i} className="particle bg-white rounded-full absolute animate-float"
                                    style={{
                                        top: `${Math.random() * 100}%`,
                                        left: `${Math.random() * 100}%`,
                                        width: `${Math.random() * 3 + 1}px`,
                                        height: `${Math.random() * 3 + 1}px`,
                                        animationDuration: `${Math.random() * 10 + 10}s`,
                                        animationDelay: `${Math.random() * 5}s`
                                    }}
                                ></div>
                            ))}
                        </div>
                    </div>
                );
            case 'retro-grid':
                return (
                    <div className="absolute inset-0 bg-black overflow-hidden perspective-grid">
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,255,136,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,136,0.02))] bg-[length:50px_50px,100px_100px] animate-grid-move"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-[#000] to-transparent h-1/2 bottom-0"></div>
                    </div>
                );
            case 'clouds':
                return (
                    <div className="absolute inset-0 bg-blue-300 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-b from-blue-400 to-blue-200"></div>
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="absolute bg-white/80 rounded-full blur-xl animate-cloud-move"
                                style={{
                                    top: `${Math.random() * 30}%`,
                                    left: `-${Math.random() * 20 + 20}%`, // Start off-screen
                                    width: `${Math.random() * 200 + 100}px`,
                                    height: `${Math.random() * 60 + 40}px`,
                                    animationDuration: `${Math.random() * 20 + 30}s`,
                                    animationDelay: `${Math.random() * 10}s`
                                }}
                            ></div>
                        ))}
                    </div>
                )
            case 'default':
            default:
                return (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#2c2c2c]">
                        {/* Subtle noise or pattern */}
                        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")` }}></div>
                    </div>
                );
        }
    };

    return (
        <div className={`${className} transition-colors duration-1000 overflow-hidden`}>
            {renderBackground()}
        </div>
    );
};
