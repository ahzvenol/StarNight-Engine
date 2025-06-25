import type { 用户输入命令参数别名, 用户选择命令参数别名, 预设动画命令参数别名 } from './translation'
import type { CommandTagBlocking } from '@starnight/core'
import { Blocking, DynamicMacro } from '@starnight/core'
import { MergedCommands } from '../../index'
import { Alias, Api, flipObject } from '../../Translate'
import { 通用命令参数别名, 图像命令参数别名, 音频命令参数别名, 预设动画别名 } from './translation'

export const 对话 = Api(
    Alias(MergedCommands.Say.apply, { text: '文本', name: '名称', clip: '语音' } as const)
)

export const 设置背景 = Api(
    Alias(MergedCommands.Image.bg, Object.assign(通用命令参数别名, 图像命令参数别名))
)

export const 设置立绘 = Api(
    Alias(MergedCommands.Image.sprite, Object.assign(通用命令参数别名, 图像命令参数别名))
)

export const 添加动画 = Api(
    Alias(MergedCommands.Image.tween, Object.assign(通用命令参数别名, 图像命令参数别名))
)

export const 添加滤镜 = Api(
    Alias(MergedCommands.Image.filter, Object.assign(通用命令参数别名, { filter: '滤镜实例' } as const))
)

export const 预设动画 = Api(
    DynamicMacro<预设动画命令参数别名>(
        () =>
            function* ({ 作用目标, 预设名称, 缓动时间, X轴幅度, Y轴幅度 }) {
                yield MergedCommands.Image.animation_effect({
                    target: 作用目标,
                    preset: flipObject(预设动画别名)[预设名称],
                    duration: 缓动时间,
                    x: X轴幅度 as unknown as number,
                    y: Y轴幅度 as unknown as number
                })
            }
    )
)

export const 关闭图像 = Api(
    Alias(MergedCommands.Image.close, Object.assign(通用命令参数别名, {} as const))
)

export const 清空立绘 = Api(MergedCommands.Image.clean)

export const 设置配乐 = Api(
    Alias(MergedCommands.Audio.bgm, Object.assign(通用命令参数别名, 音频命令参数别名))
)

export const 设置音效 = Api(
    Alias(MergedCommands.Audio.se, Object.assign(通用命令参数别名, 音频命令参数别名))
)

export const 设置语音 = Api(
    Alias(MergedCommands.Audio.clip, Object.assign(通用命令参数别名, 音频命令参数别名))
)

export const 设置音量 = Api(
    Alias(MergedCommands.Audio.volume, Object.assign(通用命令参数别名, 音频命令参数别名))
)

export const 关闭音频 = Api(
    Alias(MergedCommands.Audio.close, Object.assign(通用命令参数别名, 音频命令参数别名))
)

export const 播放视频 = Api(
    Alias(MergedCommands.Video.use, Object.assign(通用命令参数别名, { skip: '允许跳过' } as const))
)

export const 用户输入 = Api(
    Blocking<用户输入命令参数别名, string>(
        (context) =>
            async (args) => {
                return MergedCommands.Input.text(args ? { text: args.描述文本 } : undefined)(context)
            }
    )
)

export const 用户选择 = Api(
    Blocking<[], number | string>(
        (context) =>
            async (args) => {
                return MergedCommands.Input.choose(
                    args.map(({ 标识符, 描述文本, 禁用 }) => ({ id: 标识符, text: 描述文本, disable: 禁用 }))
                )(context)
            }
    )
) as (<T extends number | string>(arg0: 用户选择命令参数别名<T>) => T) & CommandTagBlocking

export const 用户点击 = Api(MergedCommands.Input.click)

export const 显示界面 = Api(MergedCommands.State.box)

export const 允许点击 = Api(MergedCommands.State.click)

export const 解锁鉴赏 = Api(MergedCommands.Var.unlock)

export const 解锁成就 = Api(MergedCommands.Var.achieve)

export const 自动继续 = Api(MergedCommands.System.cont)

export const 系统计时 = Api(MergedCommands.System.wait)

export const 结束剧情 = Api(MergedCommands.System.end)

export const 嵌入页面 = Api(
    Alias(MergedCommands.Input.iframe, 通用命令参数别名)
)

export const 基本输入 = Api(MergedCommands.System.input) as (<T>(arg0: Function0<Promise<T>>) => T) & CommandTagBlocking

export const 基本动画 = Api(MergedCommands.Tween.apply)
