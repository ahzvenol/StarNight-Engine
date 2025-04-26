// https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Image_types
const IMAGE_EXTENSIONS = [
    'apng', // 动态可移植网络图形，支持动画，无损
    'avif', // AV1 图像，高效压缩，支持动画和透明
    'gif', // 图像互换格式，适合简单动画
    'jpg', // JPEG，有损压缩，广泛使用
    'jpeg', // JPEG 同上
    'jfif', // JPEG 文件交换格式
    'pjpeg', // 渐进式 JPEG
    'pjp', // JPEG 变种
    'png', // 无损压缩，支持透明
    'svg', // 矢量图形，适合图标和 UI
    'webp', // 高压缩，支持动画和透明
    // 以下格式不推荐用于 Web 内容，但浏览器支持
    'bmp', // 位图，较老格式
    'ico', // 图标文件
    'cur', // 鼠标光标，类似 ICO
    'tif', // TIFF，仅 Safari 支持
    'tiff' // TIFF 同上
]
// https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Containers
const AUDIO_EXTENSIONS = [
    '3gp', // 3GP 音频容器
    'aac', // ADTS 音频数据传输流
    'flac', // 无损音频格式
    'mp3', // MPEG-1/2 音频层 III
    'mpeg', // MPEG-1/2 音频
    'mp4', // MPEG-4 音频（如 .m4a）
    'm4a', // MPEG-4 音频
    'oga', // Ogg 音频（Vorbis）
    'ogg', // Ogg 音频容器
    'wav', // 波形音频，无损
    'webm' // WebM 音频容器
]
// https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Containers
const VIDEO_EXTENSIONS = [
    '3gp', // 3GP 视频容器
    'mp4', // MPEG-4 视频
    'm4v', // MPEG-4 视频变种
    'mpeg', // MPEG-1/2 视频
    'mpg', // MPEG-1/2 视频
    'ogv', // Ogg 视频（Theora）
    'ogg', // Ogg 视频容器
    'mov', // QuickTime 视频，仅 Safari 支持
    'webm' // WebM 视频容器
]

type MediaElement = HTMLImageElement | HTMLAudioElement | HTMLVideoElement

export class AssetLoader {
    public static loaded = new Map<string, Promise<MediaElement>>()

    public static load(url: string): Promise<MediaElement> {
        // 忽略已经加载过的资源
        if (this.loaded.get(url)) return this.loaded.get(url)!
        // 忽略没有扩展名的url
        if (url.lastIndexOf('.') === -1) return Promise.reject('未知文件类型,url不包含扩展名')
        // 截取文件扩展名
        const extension = url.split('.').pop()!.toLowerCase()
        const promise = new Promise<MediaElement>((resolve, reject) => {
            if (IMAGE_EXTENSIONS.includes(extension)) {
                const img = new Image()
                img.src = url
                img.onloadeddata = () => resolve(img)
                img.onerror = () => reject('加载失败')
            } else if (AUDIO_EXTENSIONS.includes(extension)) {
                const audio = new Audio()
                audio.src = url
                audio.oncanplay = () => resolve(audio)
                audio.onerror = () => reject('加载失败')
            } else if (VIDEO_EXTENSIONS.includes(extension)) {
                const video = document.createElement('video')
                video.src = url
                video.oncanplay = () => resolve(video)
                video.onerror = () => reject('加载失败')
            } else {
                return reject('未知文件类型,未知类型的扩展名')
            }
        })
        this.loaded.set(url, promise)
        return promise
    }
}
