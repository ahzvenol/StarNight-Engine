// Import Capacitor API
import { Capacitor } from '@capacitor/core'

// Function to detect if the platform is Android
export function isAndroid(): boolean {
    return Capacitor.getPlatform() === 'android'
}

// Function to detect if the platform is iOS
export function isIOS(): boolean {
    return Capacitor.getPlatform() === 'ios'
}

// Function to detect if the platform is Web
export function isWeb(): boolean {
    return Capacitor.getPlatform() === 'web'
}

// Function to detect if the environment is production
export function isProduction(): boolean {
    return import.meta.env.MODE === 'production'
}

// Function to detect if the environment is development
export function isDevelopment(): boolean {
    return import.meta.env.MODE === 'development'
}
