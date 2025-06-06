import type { CommandTagBlocking, GameRuntimeContext } from '@starnight/core'
import type { FilterBlockingCommands, FilterNonBlockingCommands, FlattenCommands } from '..'
import { Blocking } from '@starnight/core'
import { Alias } from '../Alias'
import { MergedCommands } from '..'

const 通用命令参数别名 = {
    id: '标识符',
    src: '资源路径',
    target: '作用目标',
    duration: '缓动时间'
} as const

const 图像命令参数别名 = {
    z: '图层高度',
    alpha: '透明度',
    anchor: '锚点',
    anchorX: 'X轴锚点',
    anchorY: 'Y轴锚点',
    angle: '角度',
    autoAlpha: '自动透明度',
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
    rotation: '旋转角度',
    saturation: '饱和度',
    scale: '缩放',
    scaleX: 'X轴缩放',
    scaleY: 'Y轴缩放',
    skew: '斜切',
    skewX: 'X轴斜切',
    skewY: 'Y轴斜切',
    tint: '染色',
    width: '宽度',
    x: 'X坐标',
    y: 'Y坐标',
    inherit: '切换图像时继承',
    ease: '缓动函数'
} as const

const 音频命令参数别名 = {
    volume: '音量',
    html5: '使用HTML5',
    loop: '循环播放',
    rate: '播放速率'
} as const

const 摇晃命令参数别名 = {
    x: 'X轴震幅',
    y: 'Y轴震幅',
    iteration: '迭代次数'
} as const

const 用户输入 = Blocking<{ 描述文本: string } | void, string>(
    (context) =>
        async (args) => {
            return MergedCommands.Input.text(args ? { text: args.描述文本 } : undefined)(context)
        }
)

const 用户选择 = Blocking<[], number | string>(
    (context) =>
        async (args) => {
            return MergedCommands.Input.choose(
                args.map(({ 标识符, 描述文本, 禁用 }) => ({ id: 标识符, text: 描述文本, disable: 禁用 }))
            )(context)
        }
) as CommandTagBlocking &
(<T extends number | string>(arg0: Array<{ 标识符: T, 描述文本: string, 禁用?: true }>) => Function1<GameRuntimeContext, Promise<T>>)

export const 中文命令集合 = {
    对话: Alias(MergedCommands.Say.apply, { text: '文本', name: '名称', clip: '语音' } as const),
    设置背景: Alias(MergedCommands.Image.bg, Object.assign(通用命令参数别名, 图像命令参数别名)),
    设置立绘: Alias(MergedCommands.Image.sprite, Object.assign(通用命令参数别名, 图像命令参数别名)),
    应用变换: Alias(MergedCommands.Image.tween, Object.assign(通用命令参数别名, 图像命令参数别名)),
    应用抖动: Alias(MergedCommands.Image.shake, Object.assign(通用命令参数别名, 摇晃命令参数别名)),
    应用摇晃: Alias(MergedCommands.Image.punch, Object.assign(通用命令参数别名, 摇晃命令参数别名)),
    应用滤镜: Alias(MergedCommands.Image.filter, Object.assign(通用命令参数别名, { filter: '滤镜实例' } as const)),
    滤镜变换: Alias(MergedCommands.Image.filter_tween, Object.assign(通用命令参数别名, {} as const)),
    关闭图像: Alias(MergedCommands.Image.close, Object.assign(通用命令参数别名, {} as const)),
    清空立绘: MergedCommands.Image.clean,
    设置背景音乐: Alias(MergedCommands.Audio.bgm, Object.assign(通用命令参数别名, 音频命令参数别名)),
    设置音效: Alias(MergedCommands.Audio.se, Object.assign(通用命令参数别名, 音频命令参数别名)),
    设置语音: Alias(MergedCommands.Audio.clip, Object.assign(通用命令参数别名, 音频命令参数别名)),
    设置音量: Alias(MergedCommands.Audio.volume, Object.assign(通用命令参数别名, 音频命令参数别名)),
    关闭音频: Alias(MergedCommands.Audio.close, Object.assign(通用命令参数别名, 音频命令参数别名)),
    播放视频: Alias(MergedCommands.Video.use, Object.assign(通用命令参数别名, { skip: '允许跳过' } as const)),
    用户输入: 用户输入,
    用户选择: 用户选择 as unknown,
    用户点击: MergedCommands.Input.click,
    显示文本框: MergedCommands.State.box,
    允许点击: MergedCommands.State.click,
    解锁鉴赏: MergedCommands.Var.unlock,
    解锁成就: MergedCommands.Var.achieve,
    自动继续: MergedCommands.System.cont,
    系统计时: MergedCommands.System.wait,
    结束游戏: MergedCommands.System.end,
    外部输入: MergedCommands.System.input as unknown,
    通用变换: MergedCommands.Tween.apply
}

export type 阻塞命令 = FilterBlockingCommands<typeof 中文命令集合>

export type 并行命令 = FilterNonBlockingCommands<typeof 中文命令集合>

export type $$等待 = FlattenCommands<阻塞命令>
    & { 用户选择: <T extends number | string>(arg0: Array<{ 标识符: T, 描述文本: string, 禁用?: true }>) => T }
    & { 外部输入: <T>(arg0: Function0<Promise<T>>) => T }

export type $$执行 = FlattenCommands<并行命令>

declare global {
    const $执行: $$执行
    const $等待: $$等待
}

Object.assign(window, { $执行: 中文命令集合, $等待: 中文命令集合 })
