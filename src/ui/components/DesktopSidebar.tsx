import React, { useState, useEffect } from 'react';
import { APP_REGISTRY } from '../../domain/os/appRegistry';

// Left Sidebar - Games & Tech Stack
export const LeftSidebar: React.FC = () => {
    return (
        <div className="hidden lg:flex flex-col gap-4 w-72 h-full p-4">
            {/* Games List - Clean card design */}
            <div className="bg-white rounded-2xl p-5 shadow-xl border border-gray-100 relative overflow-hidden">
                {/* Accent bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#5acbf7] to-blue-400"></div>

                <h3 className="text-xs font-bold text-gray-400 mb-4 tracking-[0.2em] uppercase">
                    Available Games
                </h3>
                <div className="space-y-2">
                    {APP_REGISTRY.filter(app => !['settings', 'clock', 'credits'].includes(app.id)).map((app, index) => (
                        <div
                            key={app.id}
                            className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group cursor-default"
                        >
                            <div className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm group-hover:scale-110 transition-transform">
                                {app.icon}
                            </div>
                            <div className="flex-1">
                                <span className="text-sm text-gray-700 font-medium">{app.name}</span>
                            </div>
                            <span className="text-[10px] text-gray-300 font-mono">0{index + 1}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tech Stack */}
            <div className="bg-white rounded-2xl p-5 shadow-xl border border-gray-100 flex-1 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-400 to-pink-400"></div>

                <h3 className="text-xs font-bold text-gray-400 mb-4 tracking-[0.2em] uppercase">
                    Built With
                </h3>
                <div className="flex flex-wrap gap-2">
                    {['React', 'TypeScript', 'Tailwind', 'Vite'].map(tech => (
                        <span
                            key={tech}
                            className="px-3 py-1.5 bg-gray-50 text-gray-600 text-xs font-medium rounded-full border border-gray-100"
                        >
                            {tech}
                        </span>
                    ))}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100">
                    <p className="text-[10px] text-gray-400 leading-relaxed">
                        A nostalgic GameBoy SP experience, reimagined for the modern web.
                    </p>
                </div>
            </div>
        </div>
    );
};

// Right Sidebar - Profile & Time
export const RightSidebar: React.FC = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="hidden lg:flex flex-col gap-4 w-72 h-full p-4">
            {/* Profile Card - Premium feel */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 relative overflow-hidden">
                {/* Header gradient */}
                <div className="h-16 bg-gradient-to-br from-[#5acbf7] via-blue-400 to-purple-400"></div>

                {/* Avatar */}
                <div className="relative -mt-10 flex justify-center">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-white">
                        <img
                            src="/avatar.png"
                            alt="Moussandou"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                <div className="p-5 pt-3 text-center">
                    <h3 className="font-bold text-gray-800 text-lg">Moussandou</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Full Stack Developer</p>

                    {/* Social Links */}
                    <div className="flex justify-center gap-2 mt-4">
                        <a href="https://github.com/Moussandou" target="_blank" rel="noopener noreferrer"
                            className="w-9 h-9 bg-gray-50 rounded-xl flex items-center justify-center hover:bg-gray-100 hover:scale-105 transition-all">
                            <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                            </svg>
                        </a>
                        <a href="https://www.linkedin.com/in/moussandou/" target="_blank" rel="noopener noreferrer"
                            className="w-9 h-9 bg-gray-50 rounded-xl flex items-center justify-center hover:bg-gray-100 hover:scale-105 transition-all">
                            <svg className="w-4 h-4 text-[#0077b5]" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                            </svg>
                        </a>
                        <a href="https://moussandou.github.io/Portfolio/" target="_blank" rel="noopener noreferrer"
                            className="w-9 h-9 bg-gray-50 rounded-xl flex items-center justify-center hover:bg-gray-100 hover:scale-105 transition-all">
                            <svg className="w-4 h-4 text-[#5acbf7]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                            </svg>
                        </a>
                        <a href="https://www.instagram.com/__takax__/" target="_blank" rel="noopener noreferrer"
                            className="w-9 h-9 bg-gray-50 rounded-xl flex items-center justify-center hover:bg-gray-100 hover:scale-105 transition-all">
                            <svg className="w-4 h-4 text-[#E4405F]" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>

            {/* Clock - Minimal elegant */}
            <div className="bg-white rounded-2xl p-5 shadow-xl border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-orange-400"></div>

                <div className="text-center">
                    <p className="text-4xl font-light text-gray-800 font-mono tracking-tight">
                        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <p className="text-xs text-gray-400 mt-2 capitalize">
                        {time.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </p>
                </div>
            </div>

            {/* Project Info */}
            <div className="bg-white rounded-2xl p-5 shadow-xl border border-gray-100 flex-1 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-emerald-400"></div>

                <h3 className="text-xs font-bold text-gray-400 mb-4 tracking-[0.2em] uppercase">
                    Project Info
                </h3>

                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">Version</span>
                        <span className="text-xs font-mono text-gray-700 bg-gray-50 px-2 py-0.5 rounded">1.0.0</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">Games</span>
                        <span className="text-xs font-mono text-gray-700 bg-gray-50 px-2 py-0.5 rounded">{APP_REGISTRY.filter(a => !['settings', 'clock', 'credits'].includes(a.id)).length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">Platform</span>
                        <span className="text-xs font-mono text-gray-700 bg-gray-50 px-2 py-0.5 rounded">Web</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">Responsive</span>
                        <span className="text-xs text-green-500 font-medium">Yes</span>
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-[10px] text-gray-400 text-center">
                        Made with care in 2026
                    </p>
                </div>
            </div>
        </div>
    );
};
