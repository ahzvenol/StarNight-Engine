import { log } from '@/utils/logger'

const IMAGE_EXTENSIONS = ['apng', 'avif', 'gif', 'jpg', 'jpeg', 'jfif', 'pjpeg', 'pjp', 'png', 'svg', 'webp']

const AUDIO_EXTENSIONS = [
    'mp3',
    'mpeg',
    'opus',
    'ogg',
    'oga',
    'wav',
    'aac',
    'caf',
    'm4a',
    'm4b',
    'mp4',
    'weba',
    'webm',
    'dolby',
    'flac'
]

const VIDEO_EXTENSIONS = ['apng', 'avif', 'gif', 'jpg', 'jpeg', 'jfif', 'pjpeg', 'pjp', 'png', 'svg', 'webp']

const loadedResources = new Set<string>()

export function preloadResource(url: string) {
    // 忽略已经加载过的资源
    if (loadedResources.has(url)) return
    // 忽略没有扩展名的url
    if (url.lastIndexOf('.') === -1) return

    const extension = url.split('.').pop()!.toLowerCase()

    if (IMAGE_EXTENSIONS.includes(extension)) {
        // 图片
        preloadImage(url)
    } else if (AUDIO_EXTENSIONS.includes(extension)) {
        // 音频
        preloadAudio(url)
    } else if (VIDEO_EXTENSIONS.includes(extension)) {
        // 视频
        preloadVideo(url)
    } else {
        log.warn(`未知文件类型:${extension}`)
    }

    // 记录该资源已加载
    loadedResources.add(url)
}

function preloadImage(url: string) {
    const img = new Image()
    img.src = url
    img.onload = () => log.info(`图片加载成功:${url}`)
    img.onerror = () => log.warn(`图片加载失败:${url}`)
}

function preloadAudio(url: string) {
    const audio = new Audio()
    audio.src = url
    audio.onloadeddata = () => log.info(`音频加载成功:${url}`)
    audio.onerror = () => log.warn(`音频加载失败:${url}`)
}

function preloadVideo(url: string) {
    const video = document.createElement('video')
    video.src = url
    video.onloadeddata = () => log.info(`视频加载成功:${url}`)
    video.onerror = () => log.warn(`视频加载失败:${url}`)
}
