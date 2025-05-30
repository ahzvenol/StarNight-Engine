export type GalleryItem = {
    url: string
    condition?: string | string[]
}

export type GalleryGroup = {
    cover: string
    uncover?: string
    items: GalleryItem[]
}

export const CG: Array<GalleryGroup> = [
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
