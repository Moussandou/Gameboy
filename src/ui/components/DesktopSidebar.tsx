import React, { useState, useEffect } from 'react';
import { APP_REGISTRY } from '../../domain/os/appRegistry';

// Floating particles animation
const FloatingParticle: React.FC<{ delay: number; x: number }> = ({ delay, x }) => (
    <div
        className="absolute w-1 h-1 bg-[#5acbf7] rounded-full opacity-40 animate-pulse"
        style={{
            left: `${x}%`,
            animation: `float ${3 + delay}s ease-in-out infinite`,
            animationDelay: `${delay}s`,
            top: `${20 + delay * 15}%`
        }}
    />
);

// Left Sidebar - Controls & Games
export const LeftSidebar: React.FC = () => {
    return (
        <div className="hidden lg:flex flex-col gap-4 w-64 h-full p-4">
            {/* Keyboard Controls */}
            <div className="bg-white/90 backdrop-blur rounded-2xl p-4 shadow-lg border border-gray-200">
                <h3 className="text-sm font-bold text-gray-600 mb-3 tracking-wider flex items-center gap-2">
                    <span className="text-lg">🎮</span> CONTROLS
                </h3>
                <div className="space-y-2 text-xs text-gray-500">
                    <div className="flex justify-between items-center">
                        <span>D-Pad</span>
                        <div className="flex gap-1">
                            <kbd className="px-2 py-1 bg-gray-100 rounded text-[10px] font-mono">↑</kbd>
                            <kbd className="px-2 py-1 bg-gray-100 rounded text-[10px] font-mono">↓</kbd>
                            <kbd className="px-2 py-1 bg-gray-100 rounded text-[10px] font-mono">←</kbd>
                            <kbd className="px-2 py-1 bg-gray-100 rounded text-[10px] font-mono">→</kbd>
                        </div>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>Button A</span>
                        <kbd className="px-2 py-1 bg-blue-100 text-blue-600 rounded text-[10px] font-mono">C</kbd>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>Button B</span>
                        <kbd className="px-2 py-1 bg-red-100 text-red-600 rounded text-[10px] font-mono">X</kbd>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>Start</span>
                        <kbd className="px-2 py-1 bg-gray-100 rounded text-[10px] font-mono">Enter</kbd>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>Select / Back</span>
                        <kbd className="px-2 py-1 bg-gray-100 rounded text-[10px] font-mono">Shift</kbd>
                    </div>
                </div>
            </div>

            {/* Games List */}
            <div className="bg-white/90 backdrop-blur rounded-2xl p-4 shadow-lg border border-gray-200 flex-1">
                <h3 className="text-sm font-bold text-gray-600 mb-3 tracking-wider flex items-center gap-2">
                    <span className="text-lg">🕹️</span> GAMES
                </h3>
                <div className="space-y-2">
                    {APP_REGISTRY.filter(app => !['settings', 'clock', 'credits'].includes(app.id)).map(app => (
                        <div key={app.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                            <div className="w-6 h-6">{app.icon}</div>
                            <span className="text-xs text-gray-600 font-medium">{app.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Floating Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-50">
                {[0, 1, 2, 3, 4].map(i => (
                    <FloatingParticle key={i} delay={i * 0.5} x={10 + i * 15} />
                ))}
            </div>
        </div>
    );
};

// Right Sidebar - Profile & Stats
export const RightSidebar: React.FC = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="hidden lg:flex flex-col gap-4 w-64 h-full p-4">
            {/* Profile Card */}
            <div className="bg-white/90 backdrop-blur rounded-2xl p-4 shadow-lg border border-gray-200">
                <h3 className="text-sm font-bold text-gray-600 mb-3 tracking-wider flex items-center gap-2">
                    <span className="text-lg">👤</span> DEVELOPER
                </h3>
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-2 bg-gradient-to-br from-[#5acbf7] to-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                        M
                    </div>
                    <p className="font-bold text-gray-700">Moussandou</p>
                    <p className="text-[10px] text-gray-400">Full Stack Developer</p>
                </div>
                <div className="flex justify-center gap-2 mt-3">
                    <a href="https://github.com/Moussandou" target="_blank" rel="noopener noreferrer"
                        className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors">
                        <svg className="w-4 h-4 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                    </a>
                    <a href="https://www.linkedin.com/in/moussandou/" target="_blank" rel="noopener noreferrer"
                        className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors">
                        <svg className="w-4 h-4 text-[#0077b5]" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                    </a>
                    <a href="https://moussandou.github.io/Portfolio/" target="_blank" rel="noopener noreferrer"
                        className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors">
                        <svg className="w-4 h-4 text-[#5acbf7]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                        </svg>
                    </a>
                    <a href="https://www.instagram.com/__takax__/" target="_blank" rel="noopener noreferrer"
                        className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors">
                        <svg className="w-4 h-4 text-[#E4405F]" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                    </a>
                </div>
            </div>

            {/* Clock */}
            <div className="bg-white/90 backdrop-blur rounded-2xl p-4 shadow-lg border border-gray-200">
                <h3 className="text-sm font-bold text-gray-600 mb-2 tracking-wider flex items-center gap-2">
                    <span className="text-lg">🕐</span> TIME
                </h3>
                <div className="text-center">
                    <p className="text-3xl font-bold text-gray-700 font-mono">
                        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                        {time.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'short' })}
                    </p>
                </div>
            </div>

            {/* System Status */}
            <div className="bg-white/90 backdrop-blur rounded-2xl p-4 shadow-lg border border-gray-200">
                <h3 className="text-sm font-bold text-gray-600 mb-3 tracking-wider flex items-center gap-2">
                    <span className="text-lg">📊</span> STATUS
                </h3>
                <div className="space-y-3">
                    <div>
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>🔋 Battery</span>
                            <span>100%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 w-full rounded-full"></div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>🔊 Volume</span>
                            <span>80%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-[#5acbf7] w-4/5 rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Decorative Cartridge */}
            <div className="flex-1 flex items-end justify-center pb-4">
                <div className="relative">
                    <div className="w-16 h-20 bg-gray-300 rounded-t-lg shadow-lg border-2 border-gray-400 flex items-center justify-center">
                        <div className="w-10 h-8 bg-white rounded border border-gray-300">
                            <div className="text-[6px] text-center text-gray-500 mt-1 font-bold">GAME</div>
                            <div className="text-[5px] text-center text-gray-400">CARTRIDGE</div>
                        </div>
                    </div>
                    <div className="absolute -bottom-2 left-2 right-2 h-4 bg-gray-400 rounded-b"></div>
                </div>
            </div>
        </div>
    );
};
