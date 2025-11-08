import type { MergeExclusive } from 'type-fest'
import type { TransformBlock } from '@/scripts/api/tween'
import type { Live2DCompositeCommandArgs } from '@/scripts/api/image/live2d'
import { invert, isPlainObject } from 'es-toolkit'

export const 通用命令参数映射 = {
    src: '资源路径',
    target: '作用目标',
    duration: '持续时间'
} as const

export const 图层命令参数映射 = {
    z: '图层高度',
    filters: '滤镜',
    inherit: '继承',
    exclude: '排除目标',
    transition: '过渡动画',
    transform: '变换动画'
} as const

export const 音频命令参数映射 = {
    volume: '音量',
    html5: '使用HTML5',
    loop: '循环播放',
    rate: '播放速度'
} as const

export const 变换参数映射 = invert({
    x: 'X坐标',
    y: 'Y坐标',
    width: '宽度',
    height: '高度',
    alpha: '透明度',
    pivot: '变换中心',
    pivotX: 'X轴变换中心',
    pivotY: 'Y轴变换中心',
    angle: '旋转角度',
    scale: '缩放比例',
    scaleX: 'X轴缩放比例',
    scaleY: 'Y轴缩放比例',
    skew: '斜切角度',
    skewX: 'X轴斜切角度',
    skewY: 'Y轴斜切角度',
    brightness: '亮度',
    contrast: '对比度',
    saturation: '饱和度',
    hue: '色相',
    blur: '模糊',
    blurX: '横向模糊',
    blurY: '纵向模糊',
    blurPadding: '模糊边距',
    colorize: '着色',
    colorizeAmount: '着色强度',
    ease: '缓动函数',
    repeat: '重复次数',
    yoyo: '往返动画',
    position: '动画位置',
    duration: '持续时间',
    delay: '延迟时间',
    label: '标签',
    defaults: '默认参数',
    transform: '变换动画'
})

type Pixi动画参数 = {
    X坐标?: number | string, Y坐标?: number | string, 宽度?: number | string, 高度?: number | string, 透明度?: number | string,
    变换中心?: number, X轴变换中心?: number | string, Y轴变换中心?: number | string, 旋转角度?: number | string,
    缩放比例?: number | string, X轴缩放比例?: number | string, Y轴缩放比例?: number | string,
    斜切角度?: number | string, X轴斜切角度?: number | string, Y轴斜切角度?: number | string,
    亮度?: number, 对比度?: number, 饱和度?: number, 色相?: number,
    模糊?: number, 横向模糊?: number, 纵向模糊?: number, 模糊边距?: number, 着色?: string | number, 着色强度?: number
}

type 补间变量 = Record<string, number | string>
type 滤镜变量 = Record<number, Record<string, number | string>>
type 缓动函数参数 = gsap.EaseString | gsap.EaseFunction
type GSAP特殊属性 = { 缓动函数?: 缓动函数参数, 重复次数?: number, 往返动画?: boolean, 动画位置?: number | string }
type 补间特殊属性 = { 持续时间?: number, 延迟时间?: number, 标签?: string } & GSAP特殊属性
type 时间线特殊属性 = { 默认参数?: 补间特殊属性 | 补间变量, 变换动画: Array<补间块> } & GSAP特殊属性
type 补间块 = MergeExclusive<(补间特殊属性 | (补间变量 & Pixi动画参数 & 滤镜变量)), 时间线特殊属性>
export type 变换块 = 补间特殊属性 | 时间线特殊属性 | Array<补间块>

export function TransformBlockChineseToEnglish(obj: 变换块): TransformBlock
export function TransformBlockChineseToEnglish(obj: unknown): unknown {
    if (Array.isArray(obj)) {
        for (let i = 0; i < obj.length; i++) {
            obj[i] = TransformBlockChineseToEnglish(obj[i])
        }
        return obj
    } else if (isPlainObject(obj)) {
        if ('变换动画' in obj) {
            for (let i = 0; i < obj['变换动画'].length; i++) {
                obj['变换动画'][i] = TransformBlockChineseToEnglish(obj['变换动画'][i])
            }
        }
        for (const key in obj) {
            if (key in 变换参数映射) {
                obj[变换参数映射[key as keyof typeof 变换参数映射]] = obj[key]
                delete obj[key]
            }
        }
        return obj
    }
    return obj
}

export type Live2D混合参数 = {
    作用目标: string, 动作?: string, 表情?: string,
    注视参数?: { X注视点: number, Y注视点: number, 立即注视?: boolean },
    眨眼参数?: { 眨眼间隔?: number, 随机区间?: number, 闭眼时间?: number, 睁眼时间?: number, 保持时间?: number }
}

export function Live2DArgsChineseToEnglish(obj: Live2D混合参数): Live2DCompositeCommandArgs {
    return {
        target: obj.作用目标,
        motion: obj.动作,
        expression: obj.表情,
        focus: obj.注视参数
            ? {
                    x: obj.注视参数.X注视点,
                    y: obj.注视参数.Y注视点,
                    instant: obj.注视参数.立即注视
                }
            : undefined,
        blink: obj.眨眼参数
            ? {
                    interval: obj.眨眼参数.眨眼间隔,
                    random: obj.眨眼参数.随机区间,
                    closing: obj.眨眼参数.闭眼时间,
                    opening: obj.眨眼参数.睁眼时间,
                    closed: obj.眨眼参数.保持时间
                }
            : undefined
    }
}
