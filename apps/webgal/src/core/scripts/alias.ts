import type { CommandTagBlocking, CommandTagNonBlocking } from '@starnight/core'
import { Blocking } from '@starnight/core'
import { Alias } from '../Alias'
import { FlattenCommands } from '.'

const 通用命令参数别名 = {
    id: '标识符',
    src: '资源路径',
    target: '作用目标',
    duration: '持续时间'
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
    fillColor: '填充颜色',
    height: '高度',
    hue: '色相',
    lineColor: '线条颜色',
    matrix: '变换矩阵',
    pivot: '中心点',
    pivotX: 'X轴中心点',
    pivotY: 'Y轴中心点',
    position: '位置',
    positionX: 'X轴位置',
    positionY: 'Y轴位置',
    resolution: '分辨率',
    rotation: '旋转角度',
    saturation: '饱和度',
    scale: '缩放',
    scaleX: 'X轴缩放',
    scaleY: 'Y轴缩放',
    skew: '斜切',
    skewX: 'X轴斜切',
    skewY: 'Y轴斜切',
    tilePosition: '平铺位置',
    tilePositionX: '平铺X轴位置',
    tilePositionY: '平铺Y轴位置',
    tileScale: '平铺缩放',
    tileScaleX: '平铺X轴缩放',
    tileScaleY: '平铺Y轴缩放',
    tileX: '平铺X轴坐标',
    tileY: '平铺Y轴坐标',
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
            return FlattenCommands.input_text(args ? { text: args.描述文本 } : undefined)(context)
        }
)
const 用户选择 = Blocking<{ 标识符: number | string, 描述文本: string, 禁用?: true }[], number | string>(
    (context) =>
        async (args) => {
            return FlattenCommands.input_choose(
                args.map(({ 标识符, 描述文本, 禁用 }) => ({ id: 标识符, text: 描述文本, disable: 禁用 }))
            )(context)
        }
)

const 扁平化命令 = {
    设置背景: Alias(FlattenCommands.image_bg, Object.assign(通用命令参数别名, 图像命令参数别名)),
    添加立绘: Alias(FlattenCommands.image_sprite, Object.assign(通用命令参数别名, 图像命令参数别名)),
    应用变换: Alias(FlattenCommands.image_tween, Object.assign(通用命令参数别名, 图像命令参数别名)),
    应用抖动: Alias(FlattenCommands.image_shake, Object.assign(通用命令参数别名, 摇晃命令参数别名)),
    应用摇晃: Alias(FlattenCommands.image_punch, Object.assign(通用命令参数别名, 摇晃命令参数别名)),
    应用滤镜: Alias(FlattenCommands.image_filter, Object.assign(通用命令参数别名, { filter: '滤镜实例' } as const)),
    滤镜变换: Alias(FlattenCommands.image_filter_tween, Object.assign(通用命令参数别名, {} as const)),
    关闭图像: Alias(FlattenCommands.image_close, Object.assign(通用命令参数别名, {} as const)),
    设置背景音乐: Alias(FlattenCommands.audio_bgm, Object.assign(通用命令参数别名, 音频命令参数别名)),
    设置音效: Alias(FlattenCommands.audio_se, Object.assign(通用命令参数别名, 音频命令参数别名)),
    设置语音: Alias(FlattenCommands.audio_clip, Object.assign(通用命令参数别名, 音频命令参数别名)),
    设置音量: Alias(FlattenCommands.audio_volume, Object.assign(通用命令参数别名, 音频命令参数别名)),
    关闭音频: Alias(FlattenCommands.audio_close, Object.assign(通用命令参数别名, 音频命令参数别名)),
    播放视频: Alias(FlattenCommands.video_use, Object.assign(通用命令参数别名, { skip: '允许跳过' } as const)),
    用户输入: 用户输入,
    用户选择: 用户选择,
    用户点击: FlattenCommands.input_click,
    显示文本框: FlattenCommands.state_box,
    允许点击: FlattenCommands.state_click,
    解锁鉴赏: FlattenCommands.var_unlock,
    解锁成就: FlattenCommands.var_achieve,
    自动继续: FlattenCommands.system_cont,
    系统计时: FlattenCommands.system_wait,
    结束游戏: FlattenCommands.system_end,
    外部输入: FlattenCommands.system_input
}

type Filter<T, Tag> = {
    [K in keyof T as T[K] extends Tag ? K : never]: T[K]
}

export const 阻塞命令 = 扁平化命令 as Filter<typeof 扁平化命令, CommandTagBlocking>

export const 并行命令 = 扁平化命令 as Filter<typeof 扁平化命令, CommandTagNonBlocking>

// 提取双层函数的参数和最终返回类型，并构造新函数类型
type FlattenFunction<F> = F extends (arg0: infer P0) => (arg1: infer P1) => infer R ? (arg0: P0) => Awaited<R> : never

// 处理对象，转换每个函数属性
type FlattenFunctionObject<T> = {
    [K in keyof T]: FlattenFunction<T[K]>
}

export const $等待 = 阻塞命令 as unknown as FlattenFunctionObject<typeof 阻塞命令>

export const $执行 = 并行命令 as unknown as FlattenFunctionObject<typeof 并行命令>
