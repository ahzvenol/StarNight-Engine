import { mapValues } from 'es-toolkit'

export type GalleryItem = {
    url: string
    condition?: string | string[]
}

export type MVEntry = {
    cover: string
    uncover?: string
    item: GalleryItem
}

export type CGEntry = {
    cover: string
    uncover?: string
    items: GalleryItem[]
}

export type GalleryEntry = CGEntry | MVEntry

export const CG: Array<CGEntry> = [
    ['evcg01', 'a', 'b', 'c', 'c2', 'd', 'e'],
    ['evcg20', 'a', 'b', 'c', 'd'],
    ['evcg02', 'a', 'b', 'c', 'd', 'e'],
    ['evcg03', 'a'],
    ['evcg04', 'a', 'b', 'c', 'd'],
    ['evcg05', 'a', 'b'],
    ['evcg06', 'a', 'b'],
    ['evcg07', 'a', 'b'],
    ['evcg21', 'a', 'b', 'c', 'd', 'e', 'f'],
    ['evcg08', 'a', 'b'],
    ['evcg09', 'a', 'b'],
    ['evcg10', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l'],
    ['evcg11', 'a', 'b', 'c', 'd'],
    ['evcg12', 'a', 'b', 'c'],
    ['evcg13', 'a', 'a2', 'b', 'c'],
    ['evcg19', 'a'],
    ['evcg18', 'b', 'c', 'd'],
    ['evcg14', 'a', 'b'],
    ['evcg15', 'a'],
    ['evcg16', 'a'],
    ['evcg17', 'a']
]
    .map((arr) => arr.slice(1).map((suffix) => arr[0] + suffix))
    .map((arr) => ({
        cover: `./static/ImageAsset/${arr[0]}.webp`,
        uncover: `./static/Texture2D/gallery_thumb.webp`,
        items: arr.map((item) => ({
            condition: `/ImageAsset/${item}.webp`,
            url: `./static/ImageAsset/${item}.webp`
        }))
    }))

export const MV: Array<MVEntry> = [
    { cover: `./static/op.webp`, uncover: `./static/Texture2D/gallery_thumb.webp`, item: { url: './static/OP.mp4', condition: '/OP.mp4' } },
    { cover: `./static/ed.webp`, uncover: `./static/Texture2D/gallery_thumb.webp`, item: { url: './static/ED.mp4', condition: '/ED.mp4' } }
]

export const Music = mapValues({
    [-1]: ['#?@', '', '?????', '', '???', '0:00', '#?@'],
    0: ['music1', 'スタートリップ', 'スタートリップ', '', '保科めぐみ', '4:21', 'music1'],
    1: ['music1', 'スタートリップ（inst）', 'スタートリップ', 'inst', '丸山公詳', '4:21', 'music1_b'],
    2: ['', '星空鉄道ミルキィウェイ', '星空鉄道ミルキィウェイ', '', 'project lights', '1:37', 'bgm01'],
    3: ['bgm02', '気ままな日常', '気ままな日常', '', 'project lights', '1:27', 'bgm02'],
    4: ['bgm03', '星の海', '星の海', '', 'project lights', '1:31', 'bgm03'],
    5: ['bgm04', '列車はゆく', '列車はゆく', '', 'project lights', '1:38', 'bgm04'],
    6: ['bgm05', '猫耳としっぽ', '猫耳としっぽ', '', 'project lights', '1:19', 'bgm05'],
    7: ['bgm06', 'cutie conductor', 'cutie conductor', '', 'project lights', '1:23', 'bgm06'],
    8: ['bgm07', 'おかえりなさい', 'おかえりなさい', '', 'project lights', '1:32', 'bgm07'],
    9: ['bgm08', '暗影', '暗影', '', 'project lights', '1:13', 'bgm08'],
    10: ['bgm09', '砕け散る星', '砕け散る星', '', 'project lights', '1:45', 'bgm09'],
    11: ['bgm10', '終わらない旅', '終わらない旅', '', 'project lights', '1:54', 'bgm10'],
    12: ['bgm11', 'スタートリップ（piano ver.）', 'スタートリップ', 'piano ver.', '保科めぐみ', '1:50', 'bgm11'],
    13: ['music2', 'ひだまりの場所', 'ひだまりの場所', '', '保科めぐみ', '4:50', 'music2'],
    14: ['music2', 'ひだまりの場所（inst）', 'ひだまりの場所', 'inst', '丸山公詳', '4:48', 'music2_b']
}, (value) => [`/AudioClip/${value[0]}.flac`, value[1], value[2], value[3], value[4], value[5], `./static/AudioClip/${value[6]}.flac`]) as
Record<number, [string, string, string, string, string, string, string]>
