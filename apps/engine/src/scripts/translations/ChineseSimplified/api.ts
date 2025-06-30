import type { 添加动画命令参数别名, 用户输入命令参数别名, 用户选择命令参数别名, 动效动画命令参数别名 } from './translation'
import type { CommandTagBlocking, CommandTagDynamic } from '@starnight/core'
import { Blocking, DynamicMacro } from '@starnight/core'
import { MergedCommands } from '../../index'
import { Alias, Api, flipObject } from '../../Translate'
import { 通用命令参数别名, 图像命令参数别名, 音频命令参数别名, 动效动画别名 } from './translation'

/**
 * 显示对话内容，设置角色名称和播放语音。
 * @param 参数对象
 * @param .文本 - 要显示的文本内容（必需）
 * @param .名称 - 要显示的角色名称（可选）
 * @param .语音 - 要播放的语音文件路径（可选）
 * @example
 * 对话({ 文本: "咕咕咕", 名称: "鸽子", 语音: "/咕.mp3" })
 */
export const 对话 = Api(
    Alias(MergedCommands.Say.apply, { text: '文本', name: '名称', clip: '语音' } as const)
)

/**
 * 设置背景图片，使用 GSAP 实现，支持位置、缩放、滤镜等属性。
 * @remarks
 * - `持续时间` 仅控制背景图片的入场动画时长（淡入效果），其他属性（如位置、缩放、滤镜等）会立即应用。
 * - 参数值支持数值或字符串（如 "+=100"），+= 表示相对于当前值的增量，但并不是所有参数都可以使用 +=
 * @param 参数对象
 * @param .资源路径 - 背景图片的文件路径（必需）
 * @param .持续时间 - 入场动画持续时间，单位毫秒（可选，默认 225）
 * @param .X坐标 - 横坐标（可选，默认 0）
 * @param .Y坐标 - 纵坐标（可选，默认 0）
 * @param .宽度 - 图片宽度（可选，默认图片自身宽度）
 * @param .高度 - 图片高度（可选，默认图片自身高度）
 * @param .X轴缩放 - 横轴缩放比例（可选，默认 1）
 * @param .Y轴缩放 - 纵轴缩放比例（可选，默认 1）
 * @param .旋转角度 - 图片旋转角度，单位为度（可选）
 * @param .斜切 - 整体斜切变换（可选）
 * @param .X轴斜切 - 横轴斜切变换（可选）
 * @param .Y轴斜切 - 纵轴斜切变换（可选）
 * @param .中心点 - 图片整体变换的基准点（可选）
 * @param .X轴中心点 - 横轴变换的基准点（可选）
 * @param .Y轴中心点 - 纵轴变换的基准点（可选）
 * @param .锚点 - 图片整体纹理的锚点，范围 0 到 1（可选）
 * @param .X轴锚点 - 横轴纹理的锚点（可选）
 * @param .Y轴锚点 - 纵轴纹理的锚点（可选）
 * @param .模糊 - 整体模糊效果强度（可选）
 * @param .横向模糊 - 横向模糊效果强度（可选）
 * @param .纵向模糊 - 纵向模糊效果强度（可选）
 * @param .模糊边距 - 模糊效果的边距（可选）
 * @param .亮度 - 亮度调整，范围 0 到无穷大（可选，1 为无调整）
 * @param .对比度 - 对比度调整，范围 0 到无穷大（可选，1 为无调整）
 * @param .色相 - 色相调整，单位为度（可选，0 为无调整）
 * @param .饱和度 - 饱和度调整，范围 0 到无穷大（可选，1 为无调整）
 * @param .着色 - 着色效果，接受颜色值（如 "#ff0000" 或 0xff0000）（可选）
 * @param .着色强度 - 着色效果强度，范围 0 到 1（可选，0 为无着色，1 为完全着色）
 * @param .颜色矩阵滤镜 - 自定义颜色矩阵滤镜对象（可选）
 * @param .合并颜色矩阵 - 是否合并颜色矩阵滤镜（可选，默认 false）
 * @param .变换矩阵 - 自定义变换矩阵，类型为 PixiPlugin.PixiMatrix（可选）
 * @example
 * 设置背景({ 资源路径: "/咸鱼池塘.jpg", X坐标: -120, 持续时间: 500, 模糊: 5, 亮度: 1.2 })
 */
export const 设置背景 = Api(
    Alias(MergedCommands.Image.bg, Object.assign(通用命令参数别名, 图像命令参数别名))
)

/**
 * 设置角色立绘图片，使用 GSAP 实现，支持位置、缩放、滤镜等属性。
 * @remarks
 * - 多次为同一标识符设置新立绘时，应确保之前的入场动画已完成，以避免亮度异常的错误。
 * - `持续时间` 仅控制立绘图片的入场动画时长（淡入效果），其他属性（如位置、缩放、滤镜等）会立即应用。
 * - 参数值支持数值或字符串（如 "+=100"），+= 表示相对于当前值的增量，但并不是所有参数都可以使用 +=
 * @param 参数对象
 * @param .标识符 - 立绘的标识符，用于后续操作（必需）
 * @param .资源路径 - 立绘图片的文件路径（必需）
 * @param .持续时间 - 入场动画持续时间，单位毫秒（可选，默认 225）
 * @param .图层高度 - 立绘的图层高度，控制遮挡关系，值越大越靠前显示（可选，默认 1）
 * @param .X坐标 - 横坐标（可选，默认 0）
 * @param .Y坐标 - 纵坐标（可选，默认 0）
 * @param .宽度 - 图片宽度（可选，默认图片自身宽度）
 * @param .高度 - 图片高度（可选，默认图片自身高度）
 * @param .X轴缩放 - 横轴缩放比例（可选，默认 1）
 * @param .Y轴缩放 - 纵轴缩放比例（可选，默认 1）
 * @param .旋转角度 - 图片旋转角度，单位为度（可选）
 * @param .斜切 - 整体斜切变换（可选）
 * @param .X轴斜切 - 横轴斜切变换（可选）
 * @param .Y轴斜切 - 纵轴斜切变换（可选）
 * @param .中心点 - 图片整体变换的基准点（可选）
 * @param .X轴中心点 - 横轴变换的基准点（可选）
 * @param .Y轴中心点 - 纵轴变换的基准点（可选）
 * @param .锚点 - 图片整体纹理的锚点，范围 0 到 1（可选）
 * @param .X轴锚点 - 横轴纹理的锚点（可选）
 * @param .Y轴锚点 - 纵轴纹理的锚点（可选）
 * @param .模糊 - 整体模糊效果强度（可选）
 * @param .横向模糊 - 横向模糊效果强度（可选）
 * @param .纵向模糊 - 纵向模糊效果强度（可选）
 * @param .模糊边距 - 模糊效果的边距（可选）
 * @param .亮度 - 亮度调整，范围 0 到无穷大（可选，1 为无调整）
 * @param .对比度 - 对比度调整，范围 0 到无穷大（可选，1 为无调整）
 * @param .色相 - 色相调整，单位为度（可选，0 为无调整）
 * @param .饱和度 - 饱和度调整，范围 0 到无穷大（可选，1 为无调整）
 * @param .着色 - 着色效果，接受颜色值（如 "#ff0000" 或 0xff0000）（可选）
 * @param .着色强度 - 着色效果强度，范围 0 到 1（可选，0 为无着色，1 为完全着色）
 * @param .颜色矩阵滤镜 - 自定义颜色矩阵滤镜对象（可选）
 * @param .合并颜色矩阵 - 是否合并颜色矩阵滤镜（可选，默认 false）
 * @param .变换矩阵 - 自定义变换矩阵，类型为 PixiPlugin.PixiMatrix（可选）
 * @example
 * 设置立绘({ 标识符: "咸鱼", 资源路径: "/saltfish/fish.jpg", X坐标: 640, Y坐标: 640, 持续时间: 500, 模糊: 5 })
 */
export const 设置立绘 = Api(
    Alias(MergedCommands.Image.sprite, Object.assign(通用命令参数别名, 图像命令参数别名))
)

/**
 * 为指定目标添加动画效果，使用 GSAP 实现，支持位置、缩放、滤镜等属性。
 * @remarks
 * - 针对同一目标的多个动画将按顺序执行，前一个动画完成后触发后一个动画。
 * - 可访问 https://gsap.com/docs/v3/Eases/CustomEase 查看 GSAP 缓动预设或创建自定义缓动曲线。
 * - 参数值支持数值或字符串（如 "+=100"），+= 表示相对于当前值的增量，但并不是所有参数都可以使用 +=
 * @param 参数对象
 * @param .作用目标 - 动画应用的目标标识符，舞台的标识符为0，背景的标识符为1（必需）
 * @param .持续时间 - 动画持续时间，单位毫秒（可选，默认 0，无动画）
 * @param .缓动函数 - 动画缓动函数，支持 GSAP 缓动预设、缓动曲线或函数（可选，默认 "none"）
 * @param .继承 - 是否在切换图像后继承当前动画属性（默认 true）
 * @param .X坐标 - 横坐标（可选，默认 0）
 * @param .Y坐标 - 纵坐标（可选，默认 0）
 * @param .宽度 - 图片宽度（可选，默认图片自身宽度）
 * @param .高度 - 图片高度（可选，默认图片自身高度）
 * @param .X轴缩放 - 横轴缩放比例（可选，默认 1）
 * @param .Y轴缩放 - 纵轴缩放比例（可选，默认 1）
 * @param .旋转角度 - 图片旋转角度，单位为度（可选）
 * @param .斜切 - 整体斜切变换（可选）
 * @param .X轴斜切 - 横轴斜切变换（可选）
 * @param .Y轴斜切 - 纵轴斜切变换（可选）
 * @param .中心点 - 图片整体变换的基准点（可选）
 * @param .X轴中心点 - 横轴变换的基准点（可选）
 * @param .Y轴中心点 - 纵轴变换的基准点（可选）
 * @param .锚点 - 图片整体纹理的锚点，范围 0 到 1（可选）
 * @param .X轴锚点 - 横轴纹理的锚点（可选）
 * @param .Y轴锚点 - 纵轴纹理的锚点（可选）
 * @param .模糊 - 整体模糊效果强度（可选）
 * @param .横向模糊 - 横向模糊效果强度（可选）
 * @param .纵向模糊 - 纵向模糊效果强度（可选）
 * @param .模糊边距 - 模糊效果的边距（可选）
 * @param .亮度 - 亮度调整，范围 0 到无穷大（可选，1 为无调整）
 * @param .对比度 - 对比度调整，范围 0 到无穷大（可选，1 为无调整）
 * @param .色相 - 色相调整，单位为度（可选，0 为无调整）
 * @param .饱和度 - 饱和度调整，范围 0 到无穷大（可选，1 为无调整）
 * @param .着色 - 着色效果，接受颜色值（如 "#ff0000" 或 0xff0000）（可选）
 * @param .着色强度 - 着色效果强度，范围 0 到 1（可选，0 为无着色，1 为完全着色）
 * @param .颜色矩阵滤镜 - 自定义颜色矩阵滤镜对象（可选）
 * @param .合并颜色矩阵 - 是否合并颜色矩阵滤镜（可选，默认 false）
 * @param .变换矩阵 - 自定义变换矩阵，类型为 PixiPlugin.PixiMatrix（可选）
 * @example
 * 添加动画({ 作用目标: "咸鱼", X坐标: "+=100", Y坐标: 720, 持续时间: 1000, 缓动函数: "M0,0,C0,0,1,1,1,1" })
 */
export const 添加动画 = Api(
    Alias(MergedCommands.Image.tween, Object.assign(通用命令参数别名, 图像命令参数别名))
) as ((arg0: 添加动画命令参数别名) => void) & CommandTagDynamic

/**
 * 为指定目标添加滤镜，使用 PixiJS 滤镜实现。
 * @remarks
 * - 滤镜动画可通过 基本动画 命令实现。
 * @param 参数对象
 * @param .作用目标 - 滤镜应用的目标标识符，舞台的标识符为0，背景的标识符为1（必需）
 * @param .滤镜实例 - PixiJS 滤镜实例，需为有效的 Filter 对象（必需）
 * @example
 * 添加滤镜({ 作用目标: "咸鱼", 滤镜实例: new BlurFilter(5) })
 */
export const 添加滤镜 = Api(
    Alias(MergedCommands.Image.filter, Object.assign(通用命令参数别名, { filter: '滤镜实例' } as const))
)

/**
 * 为指定目标应用一段动效动画。
 * @remarks
 * - 动效动画会独立于主动画序列同时运行，但同一时间只应运行一个动效动画。
 * @param 参数对象
 * @param .作用目标 - 动画应用的目标标识符，舞台的标识符为0，背景的标识符为1（必需）
 * @param .预设名称 - 动画名称，如 "震动" 或 "摇晃"（必需）
 * @param .持续时间 - 动画持续时间，单位毫秒（必需）
 * @param .X轴幅度 - 横向动画幅度（可选，需至少提供 X轴幅度 或 Y轴幅度 两个参数中的一个）
 * @param .Y轴幅度 - 纵向动画幅度（可选，需至少提供 X轴幅度 或 Y轴幅度 两个参数中的一个）
 * @example
 * 动效动画({ 作用目标: "咸鱼", 预设名称: "摇晃", Y轴幅度: 15, 持续时间: 1000 })
 */
export const 动效动画 = Api(
    DynamicMacro<动效动画命令参数别名>(
        () =>
            function* ({ 作用目标, 预设名称, 持续时间, X轴幅度, Y轴幅度 }) {
                yield MergedCommands.Image.animation({
                    target: 作用目标,
                    type: flipObject(动效动画别名)[预设名称],
                    duration: 持续时间,
                    x: X轴幅度 as unknown as number,
                    y: Y轴幅度 as unknown as number
                })
            }
    )
)

/**
 * 关闭指定的立绘或背景，支持淡出动画。
 * @remarks
 * - `持续时间` 控制图像消失时的淡出动画时长。
 * - `作用目标` 可以是一个或多个标识符组成的数组，用于同时关闭多个图像。
 * @param 参数对象
 * @param .作用目标 - 关闭图像的目标标识符或标识符数组，背景的标识符为1（必需）。
 * @param .持续时间 - 淡出动画的持续时间，单位毫秒（可选，默认 225）。
 * @example
 * // 关闭单个立绘
 * 关闭图像({ 作用目标: "咸鱼" })
 * // 同时关闭多个立绘
 * 关闭图像({ 作用目标: ["咸鱼", "鸽子"] })
 */
export const 关闭图像 = Api(
    Alias(MergedCommands.Image.close, Object.assign(通用命令参数别名, {} as const))
)

/**
 * 立即移除所有立绘，无淡出动画。
 * @example
 * 清空立绘()
 */
export const 清空立绘 = Api(MergedCommands.Image.clean)

/**
 * 设置背景音乐（BGM），使用 Howler 实现，支持音量、循环播放等属性。
 * @remarks
 * - `持续时间` 控制音量缓入缓出的持续时间。
 * - 如果提供 `音量` 参数，音频将通过 `持续时间` 渐入到指定音量。
 * - `音量`、`播放速度` 等参数不会在同一音轨上继承，需重新设置。
 * @param 参数对象
 * @param .资源路径 - 音频的文件路径（必需）
 * @param .标识符 - 音轨的标识符（可选，默认 "bgm"）
 * @param .持续时间 - 音量缓入缓出时间，单位毫秒（可选，默认 0）
 * @param .音量 - 音频的音量，范围 0 到 1（可选，默认 1）
 * @param .循环播放 - 是否循环播放（可选，默认 true）
 * @param .播放速度 - 音频播放速度，范围 0.5 到 4（可选，1 为无调整）
 * @param .使用HTML5 - 是否使用 HTML5 音频播放，适合大文件以减少加载时间（可选，默认自动选择）
 * @example
 * 设置配乐({ 资源路径: "/bgm01.mp3", 持续时间: 1000, 音量: 0.5 })
 */
export const 设置配乐 = Api(
    Alias(MergedCommands.Audio.bgm, Object.assign(通用命令参数别名, 音频命令参数别名))
)

/**
 * 设置音效（SE），使用 Howler 实现，支持音量、循环播放等属性。
 * @remarks
 * - `持续时间` 控制音量缓入缓出的持续时间。
 * - 如果提供 `音量` 参数，音频将通过 `持续时间` 渐入到指定音量。
 * - `音量`、`播放速度` 等参数不会在同一音轨上继承，需重新设置。
 * @param 参数对象
 * @param .资源路径 - 音频的文件路径（必需）
 * @param .标识符 - 音轨的标识符（可选，默认 "se"）
 * @param .持续时间 - 音量缓入缓出时间，单位毫秒（可选，默认 0）
 * @param .音量 - 音频的音量，范围 0 到 1（可选，默认 1）
 * @param .循环播放 - 是否循环播放（可选，默认 false）
 * @param .播放速度 - 音频播放速度，范围 0.5 到 4（可选，1 为无调整）
 * @param .使用HTML5 - 是否使用 HTML5 音频播放，适合大文件以减少加载时间（可选，默认自动选择）
 * @example
 * 设置音效({ 资源路径: "/se01.mp3", 循环播放: true, 持续时间: 500, 音量: 0.7 })
 */
export const 设置音效 = Api(
    Alias(MergedCommands.Audio.se, Object.assign(通用命令参数别名, 音频命令参数别名))
)

/**
 * 设置角色语音（Clip），使用 Howler 实现，支持音量、播放速度等属性。
 * @remarks
 * - 语音的音轨标识符固定为 "clip"
 * - 通常应使用 `对话` 命令设置语音，单独使用 `设置语音` 将不会记录到 Backlog。
 * - `音量`、`播放速度` 等参数不会在同一音轨上继承，需重新设置。
 * @param 参数对象
 * @param .资源路径 - 音频的文件路径（必需）
 * @param .音量 - 音频的音量，范围 0 到 1（可选，默认 1）
 * @param .播放速度 - 音频播放速度，范围 0.5 到 4（可选，1 为无调整）
 * @param .使用HTML5 - 是否使用 HTML5 音频播放，适合大文件以减少加载时间（可选，默认自动选择）
 * @example
 * 设置语音({ 资源路径: "/noi01.mp3", 音量: 0.8, 播放速度: 1.2 })
 */
export const 设置语音 = Api(
    Alias(MergedCommands.Audio.clip, Object.assign(通用命令参数别名, 音频命令参数别名))
)

/**
 * 设置指定音轨的音量，使用 Howler 实现，支持渐变过渡。
 * @remarks
 * - `持续时间` 控制音量渐变的过渡时间，未设置时音量立即应用。
 * @param 参数对象
 * @param .作用目标 - 音轨的标识符（必需）
 * @param .音量 - 目标音量，范围 0 到 1（必需）
 * @param .持续时间 - 音量渐变过渡时间，单位毫秒（可选）
 * @example
 * 设置音量({ 作用目标: "bgm", 音量: 0.5, 持续时间: 1000 })
 */
export const 设置音量 = Api(
    Alias(MergedCommands.Audio.volume, Object.assign(通用命令参数别名, 音频命令参数别名))
)

/**
 * 关闭指定音轨的音频，使用 Howler 实现，支持渐变淡出。
 * @remarks
 * - `持续时间` 控制音量渐出的过渡时间，未设置时立即关闭。
 * @param 参数对象
 * @param .作用目标 - 要关闭的音轨标识符（必需）
 * @param .持续时间 - 音量渐出过渡时间，单位毫秒（可选）
 * @example
 * 关闭音频({ 作用目标: "bgm", 持续时间: 1000 })
 */
export const 关闭音频 = Api(
    Alias(MergedCommands.Audio.close, Object.assign(通用命令参数别名, 音频命令参数别名))
)

/**
 * 播放一段转场动画。
 * @remarks
 * - 转场动画用于场景切换，但不会自动处理背景或立绘的转场。
 * @param 预设名称 - 转场动画名称（如 "BlindH8"）
 * @example
 * 转场动画("BlindH8")
 */
export const 转场动画 = Api(MergedCommands.Transition.apply)

/**
 * 播放视频。
 * @param 参数对象
 * @param .资源路径 - 视频的文件路径（必需）
 * @param .允许跳过 - 是否允许用户跳过视频（可选，默认 true）
 * @example
 * 播放视频({ 资源路径: "/OP.mp4", 允许跳过: false })
 */
export const 播放视频 = Api(
    Alias(MergedCommands.Video.use, Object.assign(通用命令参数别名, { skip: '允许跳过' } as const))
)

/**
 * 显示输入框并获取用户输入的文本。
 * @param 参数对象 - （可选）
 * @param .描述文本 - 输入框显示的提示文本（（可选）
 * @returns 用户输入的文本
 * @example
 * const res = $等待.用户输入({ 描述文本: "请输入你的名字" })
 */
export const 用户输入 = Api(
    Blocking<用户输入命令参数别名, string>(
        (context) =>
            async (args) => {
                return MergedCommands.Input.text(args ? { text: args.描述文本 } : undefined)(context)
            }
    )
)

/**
 * 显示选项列表并获取用户所选项的标识符。
 * @param 参数数组
 * @param .标识符 - 选项的标识符（必需）
 * @param .描述文本 - 选项显示的文本（必需）
 * @param .禁用 - 是否禁用该选项（可选，默认 false）
 * @returns 用户所选项的标识符
 * @example
 * const label = $等待.用户选择([
 *   { 标识符: "*そのまま渡す", 描述文本: "直接给她" },
 *   { 标识符: "*振ってから渡す", 描述文本: "晃晃再给她" }
 * ])
 */
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

/**
 * 等待用户点击。
 * @example
 * $等待.用户点击()
 */
export const 用户点击 = Api(MergedCommands.Input.click)

/**
 * 显示或隐藏游戏的 UI 界面（如文本框、选项栏等）。
 * @remarks
 * - 设置 `false` N 次，需相应设置 `true` N 次以复位。
 * @param 状态 - true 为显示，false 为隐藏
 * @example
 * 显示界面(true)
 */
export const 显示界面 = Api(MergedCommands.State.ui)

/**
 * 允许或禁止用户点击以继续剧情。
 * - 设置 `false` N 次，需相应设置 `true` N 次以复位。
 * @param 状态 - true 为允许，false 为禁止
 * @example
 * 允许点击(true)
 */
export const 允许点击 = Api(MergedCommands.State.click)

/**
 * 解锁 CG 或其他鉴赏内容。
 * @remarks
 * - 在默认情况下，设置背景、立绘、音频等时，将自动解锁相关鉴赏内容。
 * @param 资源路径 - 要解锁的 CG 或内容文件路径
 * @example
 * 解锁鉴赏("cg01.jpg")
 */
export const 解锁鉴赏 = Api(MergedCommands.Var.unlock)

/**
 * 解锁指定成就。
 * @param 成就ID - 成就的编号
 * @example
 * 解锁成就(1)
 */
export const 解锁成就 = Api(MergedCommands.Var.achieve)

/**
 * 自动进入下一幕，无需用户点击。
 * @example
 * 自动继续()
 */
export const 自动继续 = Api(MergedCommands.System.cont)

/**
 * 等待指定时间。
 * @param 时间 - 等待时间，单位毫秒
 * @example
 * $等待.系统计时(500)
 */
export const 系统计时 = Api(MergedCommands.System.wait)

/**
 * 结束当前剧情，停止后续执行。
 * @remarks
 * - 在默认情况下，命令执行后将返回标题页。
 * @example
 * 结束剧情()
 */
export const 结束剧情 = Api(MergedCommands.System.end)

/**
 * 嵌入 iframe 页面，显示外部内容。
 * @remarks
 * - 嵌入的页面需通过 `window.parent.postMessage` 发送结果，发送的数据将作为命令返回值。
 * @param 参数对象
 * @param .资源路径 - iframe 的 URL （必需）
 * @returns 页面发送的结果数据
 * @example
 * $等待.嵌入页面({ 资源路径: "example.com" })
 */
export const 嵌入页面 = Api(
    Alias(MergedCommands.Input.iframe, 通用命令参数别名)
)

/**
 * 执行自定义输入并返回结果。
 * @remarks
 * - 如果程序的结果不是确定的，如获取日期、随机数或外部输入，可以使用此命令。
 * @param 回调函数 - 返回 Promise 的函数（必需）
 * @returns 回调函数的结果
 * @example
 * $等待.基本输入(async () => new Date().toISOString())
 */
export const 基本输入 = Api(MergedCommands.System.input) as (<T>(arg0: Function0<Promise<T>>) => T) & CommandTagBlocking

/**
 * 为任意对象添加动画效果，使用 GSAP 实现。
 * @remarks
 * - 可访问 https://gsap.com/resources/position-parameter 查看 GSAP 位置参数用法。
 * - 可访问 https://gsap.com/docs/v3/Eases/CustomEase 查看 GSAP 缓动预设或创建自定义缓动曲线。
 * - 参数值支持数值或字符串（如 "+=100"），+= 表示相对于当前值的增量，但并不是所有参数都可以使用 +=
 * @param 参数对象 - GSAP 动画参数
 * @param .目标 - 动画应用的目标对象，接受 GSAP 支持的 TweenTarget（必需）
 * @param .模式 - 动画模式，"from" 表示从指定值开始，"to" 表示到指定值结束（可选，默认 "to"）
 * @param .持续时间 - 动画持续时间，单位毫秒（可选，默认 0）
 * @param .缓动函数 - 动画缓动函数，支持 GSAP 缓动预设、缓动曲线或函数（可选，默认 "none"）
 * @param .标识符 - 动画序列的标识符，针对同一标识符的多个动画将按顺序执行。（可选，默认与目标参数值相同）
 * @param .位置 - 动画在 GSAP 动画序列中的位置，可传入符合 GSAP 位置参数要求的值 （可选）
 * @param ...属性 - 目标对象的任意属性，如 scale、opacity 等
 * @example
 * 基本动画({ 目标: document.querySelector(".box"), x: "+=100", opacity: 0.5, 持续时间: 1000 })
 */
export const 基本动画 = Api(
    Alias(
        MergedCommands.Tween.apply,
        { id: '标识符', target: '作用目标', duration: '持续时间', mode: '模式', ease: '缓动函数', position: '位置' } as const
    )
)
