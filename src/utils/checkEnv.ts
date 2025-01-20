import { Capacitor } from '@capacitor/core'

export function isAndroid(): boolean {
    return Capacitor.getPlatform() === 'android'
}

export function isIOS(): boolean {
    return Capacitor.getPlatform() === 'ios'
}

export function isWeb(): boolean {
    return Capacitor.getPlatform() === 'web'
}

export function isProduction(): boolean {
    return import.meta.env.MODE === 'production'
}

export function isDevelopment(): boolean {
    return import.meta.env.MODE === 'development'
}

export function isMobile(): boolean {
    return window.matchMedia('(hover: none)').matches
}
