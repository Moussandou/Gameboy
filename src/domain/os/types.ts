export type AppId = 'snake' | 'settings' | 'breakout' | 'simon' | 'clock' | 'tetris' | 'credits' | 'profile';

export interface AppConfig {
    id: AppId;
    name: string;
    icon: React.ReactNode; // SVG Component
    component: React.ComponentType<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export type OSState = 'BOOT' | 'HOME' | 'APP_RUNNING';

export interface SystemState {
    status: OSState;
    currentAppId: AppId | null;
    volume: number;
    brightness: number;
    booted: boolean;
}
