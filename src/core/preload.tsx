import type { RuntimeCommandLike } from './types/Command'
import { isString } from 'es-toolkit'
import book from '@/store/book'
import { log } from '@/utils/logger'

// 基于命名约定的预加载,搜索所有名称为file的参数
export function preloadByNamingConvention(rows: Array<RuntimeCommandLike>) {
    rows.forEach((row) => {
        if (Array.isArray(row.args)) preloadByNamingConvention(row.args)
        else
            Object.entries(row.args)
                .filter(([key]) => key === 'file')
                .map((kv) => kv[1])
                .filter((value) => isString(value))
                .forEach((value) => preloadResource(value))
    })
}

export async function preloadWithIndex(index: number) {
    if (index >= (await book.length())) return
    const rows = await book.full(index)
    preloadByNamingConvention(rows)
}

// 以下为核心逻辑无关的预加载实现

const loadedResources = new Set<string>()

function preloadResource(url: string) {
    // 忽略已经加载过的资源
    if (loadedResources.has(url)) return
    // 忽略没有扩展名的url
    if (url.lastIndexOf('.') === -1) return

    const extension = url.split('.').pop()!.toLowerCase()

    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg', 'tiff', 'ico'].includes(extension)) {
        // 图片
        preloadImage(url)
    } else if (['mp3', 'wav', 'flac', 'ogg', 'aac', 'm4a', 'opus'].includes(extension)) {
        // 音频
        preloadAudio(url)
    } else if (['mp4', 'webm', 'ogg', 'avi', 'mov', 'mkv'].includes(extension)) {
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
