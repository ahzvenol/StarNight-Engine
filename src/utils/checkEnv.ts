import { Capacitor } from '@capacitor/core'

export const platform = Capacitor.getPlatform()

export function isAndroid(): boolean {
    return platform === 'android'
}

export function isIOS(): boolean {
    return platform === 'ios'
}

export function isWeb(): boolean {
    return platform === 'web'
}

export function isNative(): boolean {
    return Capacitor.isNativePlatform()
}

export function isMobile(): boolean {
    return isAndroid() || isIOS()
}

export function isProduction(): boolean {
    return !isDevelopment()
}

export function isDevelopment(): boolean {
    return import.meta.env.DEV === true
}
