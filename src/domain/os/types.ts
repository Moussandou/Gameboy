export type AppId = 'snake' | 'settings' | 'browser' | 'breakout' | 'simon';

export interface AppConfig {
    id: AppId;
    name: string;
    icon: React.ReactNode; // SVG Component
    component: React.ComponentType<any>;
}

export type OSState = 'BOOT' | 'HOME' | 'APP_RUNNING';

export interface SystemState {
    status: OSState;
    currentAppId: AppId | null;
    volume: number;
    brightness: number;
    booted: boolean;
}
