# 🎮 GameBoy Online (Daily Website - Day 1)

[![Deploy to Firebase Hosting](https://github.com/Moussandou/Gameboy/actions/workflows/firebase-hosting-merge.yml/badge.svg)](https://github.com/Moussandou/Gameboy/actions/workflows/firebase-hosting-merge.yml)
[![Live Demo](https://img.shields.io/badge/demo-live-green)](https://gameboy-moussandou.web.app)

A premium, interactive GameBoy emulator experience built with **React**, **TypeScript**, and **Tailwind CSS**. This project features a curated "Wii/3DS" desktop aesthetic and is fully optimized for both desktop and mobile devices.

![Project Preview](public/preview.png) *(Note: Add a real preview image to public folder if available)*

## ✨ Features

- **🕹️ Multi-Game Library**: Includes fully playable versions of Tetris, Snake, Simon, and Breakout.
- **🎨 Premium Skins**: Multiple high-quality GameBoy skins with real-time switching.
- **📱 Mobile Optimized**: Full touch support with a custom calibration system that adapts to any screen size.
- **🖥️ Desktop Plus**: A "Wii/3DS" inspired sidebar redesign with keyboard controls, tech stack info, and project status.
- **⚙️ System Apps**: Dedicated "Settings" app to control volume, brightness, and skins directly from the GameBoy OS.
- **🔄 CI/CD Powered**: Automated type checking, linting, and deployment via GitHub Actions and Firebase Hosting.

## 🛠️ Tech Stack

- **Core**: React 18 + TypeScript
- **Styling**: Tailwind CSS (Mobile-first, Glassmorphism, Console Aesthetics)
- **Build Tool**: Vite (Lightning-fast HMR)
- **State Management**: React Context (System & Calibration)
- **Deployment**: Firebase Hosting
- **CI/CD**: GitHub Actions

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/)

### Installation

1. **Clone the repository**:
   ```bash
   git clone git@github.com:Moussandou/Gameboy.git
   cd gameboy-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

## 📂 Project Structure

```text
src/
├── app/          # Main entry and global providers
├── domain/       # Business logic, hooks, and context (Game logic, OS state)
├── infra/        # Infrastructure (Audio service, etc.)
├── ui/           # Components, apps, and module layouts
│   ├── apps/     # GameBoy OS applications (Settings, Credits, etc.)
│   ├── modules/  # Core GameBoy emulation and layout
│   └── components/ # Reusable UI components (Sidebars, Buttons)
└── index.css     # Global styles and Tailwind layers
```

## 🔧 CI/CD Pipeline

Every push to the `main` branch undergoes:
1. **TypeScript Verification**: `tsc --noEmit`
2. **Linting**: `eslint .`
3. **Production Build**: `npm run build`
4. **Auto-Deployment**: Live to [Firebase Hosting](https://gameboy-moussandou.web.app).

## 📄 License

This project is part of a "Daily Website" challenge series. Feel free to use it for inspiration!

---
Created with ❤️ by Moussandou

