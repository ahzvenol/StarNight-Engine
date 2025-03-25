import { Device } from '@capacitor/device'

export async function getDeviceInfo() {
    return {
        ...(await Device.getLanguageTag()
            .then((res) => ({ language: res.value }))
            .catch(() => ({}))),
        ...(await Device.getInfo().catch(() => ({}))),
        ...(await Device.getId().catch(() => ({})))
    }
}
