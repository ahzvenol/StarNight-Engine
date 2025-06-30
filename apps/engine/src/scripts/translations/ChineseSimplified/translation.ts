import type { ImageTarget, AnimationTypes, ImageTargetBackground, ImageTargetSprite, ImageTargetStage, ImageTweenArgs } from '../../base/image'
import type { TweenCommandArgs } from '@/scripts/base/tween'

export const 通用命令参数别名 = {
    id: '标识符',
    src: '资源路径',
    target: '作用目标',
    duration: '持续时间'
} as const

export const 图像命令参数别名 = {
    inherit: '继承',
    z: '图层高度',
    alpha: '透明度',
    anchor: '锚点',
    anchorX: 'X轴锚点',
    anchorY: 'Y轴锚点',
    angle: '旋转角度',
    blur: '模糊',
    blurX: '横向模糊',
    blurY: '纵向模糊',
    blurPadding: '模糊边距',
    brightness: '亮度',
    colorize: '着色',
    colorizeAmount: '着色强度',
    colorMatrixFilter: '颜色矩阵滤镜',
    combineCMF: '合并颜色矩阵',
    contrast: '对比度',
    height: '高度',
    hue: '色相',
    matrix: '变换矩阵',
    pivot: '中心点',
    pivotX: 'X轴中心点',
    pivotY: 'Y轴中心点',
    position: '坐标',
    saturation: '饱和度',
    scale: '缩放',
    scaleX: 'X轴缩放',
    scaleY: 'Y轴缩放',
    skew: '斜切',
    skewX: 'X轴斜切',
    skewY: 'Y轴斜切',
    width: '宽度',
    x: 'X坐标',
    y: 'Y坐标',
    ease: '缓动函数'
} as const

export const 音频命令参数别名 = {
    volume: '音量',
    html5: '使用HTML5',
    loop: '循环播放',
    rate: '播放速度'
} as const

export const 动效动画别名 = { shake: '震动', punch: '摇晃' } as const satisfies Record<AnimationTypes, string>

export type 添加动画命令参数别名 =
    { [K in keyof ImageTweenArgs as typeof 图像命令参数别名[K]]: ImageTweenArgs[K] }
    & { 缓动函数?: TweenCommandArgs['ease'], 持续时间?: number }
    & ({ 作用目标: ImageTargetStage } | { 作用目标: ImageTargetSprite | ImageTargetBackground, 继承?: false })

export type 动效动画命令参数别名 =
    { 作用目标: ImageTarget, 预设名称: (typeof 动效动画别名)[AnimationTypes], 持续时间: number }
    & ({ X轴幅度: number, Y轴幅度?: number } | { X轴幅度?: number, Y轴幅度: number })

export type 用户输入命令参数别名 = { 描述文本: string } | void

export type 用户选择命令参数别名<T> = Array<{ 标识符: T, 描述文本: string, 禁用?: true }>
