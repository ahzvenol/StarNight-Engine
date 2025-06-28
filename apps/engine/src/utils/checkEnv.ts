import { Capacitor } from '@capacitor/core'
import { isTauri } from '@tauri-apps/api/core'
import * as Tauri from '@tauri-apps/plugin-os'

const platform = isTauri() ? Tauri.platform() : Capacitor.getPlatform()

export const isAndroid = () => platform === 'android'

export const isIOS = () => platform === 'ios'

export const isWindows = () => platform === 'windows'

export const isMacOS = () => platform === 'macos'

export const isLinux = () => platform === 'linux'

export const isWeb = () => platform === 'web'

export const isMobile = () => isAndroid() || isIOS()

export const isDesktop = () => isWindows() || isMacOS() || isLinux()

export const isNative = () => isMobile() || isDesktop()

export const isTouchDevice = () => window.matchMedia('(hover: none)').matches

export const isDevelopment = () => import.meta.env.DEV === true

export const isProduction = () => !isDevelopment()
