import { Capacitor } from '@capacitor/core'

export const platform: string = Capacitor.getPlatform()

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
    return !isWeb()
}

export function isMobile(): boolean {
    return isAndroid() || isIOS()
}

export function isMobileLike(): boolean {
    return window.matchMedia('(hover: none)').matches
}

export function isProduction(): boolean {
    return !isDevelopment()
}

export function isDevelopment(): boolean {
    return import.meta.env.DEV === true
}
