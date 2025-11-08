import type { TransformBlock, TweenCommandArgs } from '@/scripts/api/tween'
import type { Live2DCompositeCommandArgs } from '@/scripts/api/image/live2d'
import type { Live2D混合参数, 变换块 } from './translation'
import { MergedCommands } from '../../scripts/index'
import { Alias, MapArgs } from '../Translate'
import { Api, TagBlocking, GenericApi } from '../ScenarioDSL'
import { 通用命令参数映射, 音频命令参数映射, 图层命令参数映射, TransformBlockChineseToEnglish, Live2DArgsChineseToEnglish } from './translation'

/**
 * 设置背景，使用 GSAP 实现，支持位置、缩放、滤镜等属性。
 * @remarks
 * - 设置新背景时，不会继承先前设置的属性。
 * - 参数值支持数值或文本（如 "+=100"），+= 表示相对于当前值的增量，但并不是所有参数都可以使用 +=
 * @param 参数对象
 * @param .资源路径 - 背景的文件路径（必需）
 * @example
 * $.设置背景({ 资源路径: "/咸鱼池塘.jpg", 持续时间: 0.5, X坐标: -120, 模糊: 5, 亮度: 1.2 })
 */
export const 设置背景 = Api(
    Alias(MergedCommands.Image.bg, Object.assign(通用命令参数映射, 图层命令参数映射))
)

/**
 * 设置角色立绘，使用 GSAP 实现，支持位置、缩放、滤镜等属性。
 * @remarks
 * - 为同一目标设置新立绘时，会继承先前设置的属性。
 * - 多次为同一目标设置新立绘时，应确保之前的入场动画已完成，以避免亮度异常的错误。
 * @param 参数对象
 * @param .作用目标 - 图层标识符，用于后续操作（必需）
 * @param .资源路径 - 立绘的文件路径（必需）
 * @example
 * $.设置立绘({ 作用目标: "咸鱼", 资源路径: "/saltfish/fish.jpg", 持续时间: 0.5, X坐标: 640, Y坐标: 640, 模糊: 5 })
 */
export const 设置立绘 = Api(
    Alias(MergedCommands.Image.sprite, Object.assign(通用命令参数映射, 图层命令参数映射))
)

/**
 * 为指定图层添加动画效果，使用 GSAP 实现，支持位置、缩放、滤镜等属性。
 * @remarks
 * - 针对同一目标的多个动画默认按顺序执行，前一个动画完成后触发后一个动画。
 * @param 参数对象
 * @param .作用目标 - 图层标识符，舞台的标识符为0，背景的标识符为1（必需）
 * @param .继承 - 是否在重新设置立绘/背景后继承动画，在背景上默认false，在立绘上默认true，在舞台上此属性不生效。
 * @example
 * $.添加动画({ 作用目标: "咸鱼", 持续时间: 0.5, X坐标: "+=100", Y坐标: 720, 缓动函数: "M0,0,C0,0,1,1,1,1" })
 */
export const 添加动画 = Api(
    MapArgs<
        { 作用目标: string | 0 | 1, 变换动画: TransformBlock, 继承?: boolean },
        { 作用目标: string | 0 | 1, 变换动画: 变换块, 继承?: boolean }, void>(
        Alias(MergedCommands.Image.tween, Object.assign(通用命令参数映射, 图层命令参数映射)),
        ({ 变换动画, ...args }) => ({ 变换动画: TransformBlockChineseToEnglish(变换动画), ...args })
    )
)

/**
 * 为指定图层设置滤镜，使用 PixiJS 滤镜实现。
 * @remarks
 * - 可访问 https://pixijs.io/filters/examples/ 查看 Pixi 滤镜预设的画面表现。
 * @param 参数对象
 * @param .作用目标 - 图层标识符，舞台的标识符为0，背景的标识符为1（必需）
 * @param .滤镜 - PixiJS 滤镜列表或滤镜设置函数（必需）
 * @param .继承 - 是否在重新设置立绘/背景后继承滤镜，在背景上默认false，在立绘上默认true，在舞台上此属性不生效。
 * @example
 * $.设置滤镜({ 作用目标: "咸鱼", 滤镜实例: new BlurFilter(5) })
 */
export const 设置滤镜 = Api(
    Alias(MergedCommands.Image.filters, Object.assign(通用命令参数映射, 图层命令参数映射))
)

/**
 * 为指定图层设置Live2D参数。
 * @param 参数对象
 * @param .作用目标 - Live2D图层标识符（必需）
 * @param .动作 - 设置Live2D动作名称（可选）
 * @param .表情 - 设置Live2D表情名称（可选）
 * @param .注视参数 - 设置Live2D角色注视位置（可选）
 * @param .注视参数.X注视点 - 注视点X坐标，范围 -1 到 1（可选）
 * @param .注视参数.Y注视点 - 注视点Y坐标，范围 -1 到 1（可选）
 * @param .注视参数.立即注视 - 是否立即移动视线到目标位置（可选）
 * @param .眨眼参数 - 调整眨眼行为的参数（可选）
 * @param .眨眼参数.眨眼间隔 - 两次眨眼之间的时间间隔，单位毫秒（可选）
 * @param .眨眼参数.随机区间 - 眨眼间隔的随机浮动区间，单位毫秒（可选）
 * @param .眨眼参数.闭眼时间 - 闭眼所用时间，单位毫秒（可选）
 * @param .眨眼参数.睁眼时间 - 睁眼所用时间，单位毫秒（可选）
 * @param .眨眼参数.保持时间 - 保持闭眼的时间，单位毫秒（可选）
 * @example
 * $.设置Live2D参数({ 作用目标: "rana", 动作: "angry01" })
 */
export const 设置Live2D = Api(
    MapArgs<
        Live2DCompositeCommandArgs,
        Live2D混合参数, void>(
        MergedCommands.Image.l2d,
        Live2DArgsChineseToEnglish
    )
)

/**
 * 关闭指定的立绘或背景，支持淡出动画。
 * @remarks
 * - `持续时间` 控制图层消失时的淡出动画时长。
 * @param 参数对象
 * @param .作用目标 - 需要关闭的图层目标标识符或标识符数组，背景的标识符为1（可选，与`排除目标`参数不同时生效）。
 * @param .排除目标 - 不需要关闭的图层目标标识符或标识符数组，背景的标识符为1（可选，与`作用目标`参数不同时生效）。
 * @param .持续时间 - 淡出动画的持续时间，单位秒（可选，默认 225）。
 * @example
 * // 关闭全部立绘
 * $.关闭图层({ 排除目标: 1 })
 * // 同时关闭多个立绘
 * $.关闭图层({ 作用目标: ["咸鱼", "鸽子"] })
 */
export const 关闭图层 = Api(
    Alias(MergedCommands.Image.close, Object.assign(通用命令参数映射, 图层命令参数映射))
)

/**
 * 设置背景音乐（BGM），使用 Howler 实现，支持音量、循环播放等属性。
 * @remarks
 * - `持续时间` 控制音量缓入缓出的持续时间。
 * - 如果提供 `音量` 参数，音频将通过 `持续时间` 渐入到指定音量。
 * - `音量`、`播放速度` 等参数不会在同一音轨上继承，需重新设置。
 * @param 参数对象
 * @param .资源路径 - 音频的文件路径（必需）
 * @param .作用目标 - 音轨的标识符（可选，默认 "bgm"）
 * @param .持续时间 - 音量缓入缓出时间，单位秒（可选，默认 0）
 * @param .音量 - 音频的音量，范围 0 到 1（可选，默认 1）
 * @param .循环播放 - 是否循环播放（可选，默认 true）
 * @param .播放速度 - 音频播放速度，范围 0.5 到 4（可选，1 为无调整）
 * @param .使用HTML5 - 是否使用 HTML5 音频播放，适合大文件以减少加载时间（可选，默认自动选择）
 * @example
 * $.设置BGM({ 资源路径: "/bgm01.mp3", 持续时间: 0.5, 音量: 0.5 })
 */
export const 设置BGM = Api(
    Alias(MergedCommands.Audio.bgm, Object.assign(通用命令参数映射, 音频命令参数映射))
)

/**
 * 设置音效（SE），使用 Howler 实现，支持音量、循环播放等属性。
 * @remarks
 * - `持续时间` 控制音量缓入缓出的持续时间。
 * - 如果提供 `音量` 参数，音频将通过 `持续时间` 渐入到指定音量。
 * - `音量`、`播放速度` 等参数不会在同一音轨上继承，需重新设置。
 * @param 参数对象
 * @param .资源路径 - 音频的文件路径（必需）
 * @param .作用目标 - 音轨的标识符（可选，默认 "se"）
 * @param .持续时间 - 音量缓入缓出时间，单位秒（可选，默认 0）
 * @param .音量 - 音频的音量，范围 0 到 1（可选，默认 1）
 * @param .循环播放 - 是否循环播放（可选，默认 false）
 * @param .播放速度 - 音频播放速度，范围 0.5 到 4（可选，1 为无调整）
 * @param .使用HTML5 - 是否使用 HTML5 音频播放，适合大文件以减少加载时间（可选，默认自动选择）
 * @example
 * $.设置音效({ 资源路径: "/se01.mp3", 循环播放: true, 持续时间: 0.5, 音量: 0.7 })
 */
export const 设置音效 = Api(
    Alias(MergedCommands.Audio.se, Object.assign(通用命令参数映射, 音频命令参数映射))
)

/**
 * 设置配音（Clip），使用 Howler 实现，支持音量、播放速度等属性。
 * @remarks
 * - 配音的音轨标识符固定为 "clip"
 * - 通常应使用 `对话` 命令设置配音，单独使用 `设置配音` 将不会记录到 Backlog。
 * - `音量`、`播放速度` 等参数不会在同一音轨上继承，需重新设置。
 * @param 参数对象
 * @param .资源路径 - 音频的文件路径（必需）
 * @param .音量 - 音频的音量，范围 0 到 1（可选，默认 1）
 * @param .播放速度 - 音频播放速度，范围 0.5 到 4（可选，1 为无调整）
 * @param .使用HTML5 - 是否使用 HTML5 音频播放，适合大文件以减少加载时间（可选，默认自动选择）
 * @example
 * $.设置配音({ 资源路径: "/noi01.mp3", 音量: 0.8, 播放速度: 1.2 })
 */
export const 设置配音 = Api(
    Alias(MergedCommands.Audio.clip, Object.assign(通用命令参数映射, 音频命令参数映射))
)

/**
 * 设置指定音轨的音量，使用 Howler 实现，支持渐变过渡。
 * @remarks
 * - `持续时间` 控制音量渐变的过渡时间，未设置时音量立即应用。
 * @param 参数对象
 * @param .作用目标 - 音轨的标识符（必需）
 * @param .音量 - 目标音量，范围 0 到 1（必需）
 * @param .持续时间 - 音量渐变过渡时间，单位秒（可选）
 * @example
 * $.设置音量({ 作用目标: "bgm", 音量: 0.5, 持续时间: 1 })
 */
export const 设置音量 = Api(
    Alias(MergedCommands.Audio.volume, Object.assign(通用命令参数映射, 音频命令参数映射))
)

/**
 * 关闭指定音轨，使用 Howler 实现，支持渐变淡出。
 * @remarks
 * - `持续时间` 控制音量渐出的过渡时间，未设置时立即关闭。
 * @param 参数对象
 * @param .作用目标 - 要关闭的音轨标识符（必需）
 * @param .持续时间 - 音量渐出过渡时间，单位秒（可选）
 * @example
 * $.关闭音频({ 作用目标: "bgm", 持续时间: 1 })
 */
export const 关闭音轨 = Api(
    Alias(MergedCommands.Audio.close, Object.assign(通用命令参数映射, 音频命令参数映射))
)

/**
 * 播放视频。
 * @param 参数对象
 * @param .资源路径 - 视频的文件路径（必需）
 * @param .允许跳过 - 是否允许用户跳过视频（可选，默认 true）
 * @example
 * $$.播放视频({ 资源路径: "/OP.mp4", 允许跳过: false })
 */
export const 播放视频 = Api(
    Alias(MergedCommands.Video.use, Object.assign(通用命令参数映射, { skip: '允许跳过' } as const))
)

/**
 * 显示输入框并获取用户输入的文本。
 * @param 描述文本 - 输入框显示的提示文本（可选）
 * @returns 用户输入的文本
 * @example
 * const res = $$.获取输入("请输入你的名字")
 */
export const 获取文本 = Api(MergedCommands.Input.text)

/**
 * 显示选项列表并获取用户所选项的标签。
 * @param 参数数组
 * @param .标签 - 选项的标签（必需）
 * @param .描述文本 - 选项显示的文本（必需）
 * @param .禁用 - 是否禁用该选项（可选，默认 false）
 * @returns 用户所选项的标签
 * @example
 * const label = $$.获取选择([
 *   { 标签: "*そのまま渡す", 描述文本: "直接给她" },
 *   { 标签: "*振ってから渡す", 描述文本: "晃晃再给她" }
 * ])
 */
export const 获取选择 = TagBlocking(
    GenericApi(
        <T extends number | string>(arg0: Array<{ 标签: T, 描述文本: string, 禁用?: true }>) =>
            MergedCommands.Input.choose(arg0.map(({ 标签, 描述文本, 禁用 }) => ({ label: 标签, text: 描述文本, disable: 禁用 })))
    )
)

/**
 * 显示或隐藏游戏的 UI 界面（如文本框、选项栏等）。
 * @remarks
 * - 设置 `false` N 次，需相应设置 `true` N 次以复位。
 * @param 状态 - true 为显示，false 为隐藏
 * @example
 * $.显示界面(true)
 */
export const 显示界面 = Api(MergedCommands.State.ui)

/**
 * 允许或禁止用户点击以继续剧情。
 * - 设置 `false` N 次，需相应设置 `true` N 次以复位。
 * @param 状态 - true 为允许，false 为禁止
 * @example
 * $.允许点击(true)
 */
export const 允许点击 = Api(MergedCommands.State.click)

/**
 * 解锁 CG 或其他鉴赏内容。
 * @remarks
 * - 在默认情况下，使用资源后，将自动解锁相关鉴赏内容。
 * @param 资源路径 - 要解锁的 CG 或内容文件路径
 * @example
 * $.解锁鉴赏("cg01.jpg")
 */
export const 解锁鉴赏 = Api(MergedCommands.Var.unlock)

/**
 * 解锁指定成就。
 * @param 成就ID - 成就的编号
 * @example
 * $.解锁成就(1)
 */
export const 解锁成就 = Api(MergedCommands.Var.achieve)

/**
 * 自动进入下一幕，无需用户点击。
 * @example
 * $.自动继续()
 */
export const 自动继续 = Api(MergedCommands.System.cont)

/**
 * 等待指定时间，然后再执行下一个命令。
 * @param 时间 - 等待时间，单位秒
 * @example
 * $$.定时等待(0.5)
 */
export const 定时等待 = Api(MergedCommands.System.wait)

/**
 * 结束剧情，停止后续执行。
 * @remarks
 * - 在默认情况下，命令执行后将返回标题页。
 * @example
 * $.结束剧情()
 */
export const 结束剧情 = Api(MergedCommands.System.end)

/**
 * 嵌入 iframe 页面，显示外部内容。
 * @remarks
 * - 嵌入的页面需通过 `window.parent.postMessage` 发送结果，发送的数据将作为命令返回值。
 * @param 资源路径 - iframe 的 URL （必需）
 * @returns 页面发送的结果
 * @example
 * $$.嵌入页面("example.com")
 */
export const 嵌入页面 = Api(MergedCommands.Input.iframe)

/**
 * 执行函数并返回结果。
 * @remarks
 * - 如果程序的结果不是确定的，如获取日期、随机数或外部输入，可以使用此命令。
 * @param 回调函数 - 返回 Promise 的函数（必需）
 * @returns 回调函数的结果
 * @example
 * $$.基本输入(async () => new Date().toISOString())
 */
export const 基本输入 = TagBlocking(
    GenericApi(MergedCommands.System.input)
)

/**
 * 为任意对象添加动画效果，使用 GSAP 实现。
 * @remarks
 * - 可访问 https://gsap.com/resources/position-parameter 查看 GSAP 位置参数用法。
 * - 可访问 https://gsap.com/docs/v3/Eases/CustomEase 查看 GSAP 缓动预设或创建自定义缓动曲线。
 * - 参数值支持数值或文本（如 "+=100"），+= 表示相对于当前值的增量，但并不是所有参数都可以使用相对值
 * @param 参数对象
 * @param .作用目标 - 动画的作用目标，接受 GSAP 支持的 TweenTarget（必需）
 * @example
 * $.基本动画({ 作用目标: document.querySelector(".box"), 持续时间: 1000, x: "+=100", opacity: 0.5 })
 */
export const 基本动画 = Api(
    MapArgs<
        TweenCommandArgs,
        { 作用目标: gsap.TweenTarget, 变换动画: 变换块 }, void>(
        MergedCommands.Tween.apply,
        ({ 作用目标, 变换动画 }) => ({ target: 作用目标, transform: TransformBlockChineseToEnglish(变换动画) })
    )
)
