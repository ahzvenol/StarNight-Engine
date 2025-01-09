import { closeAudio, fadeAudio, setAudio } from './script/audio'
import { backlog } from './script/backlog'
import { Continue, End, Jump } from './script/branch'
import { closeImage, setImage, tweenImage } from './script/image'
import { Await, Chain, Fork, Par } from './script/schedule'
import { selection, selEnd } from './script/selection'
import { punch, shake } from './script/shake'
import { icon, name, preview, text } from './script/textbox'
import { unlock } from './script/unlock'
import { variable } from './script/variable'
import { video } from './script/video'
import { wait } from './script/wait'

// 高阶命令循环引用commands,所以这里使用lazy初始化
export const commands = () =>
    ({
        // ----
        continue: Continue,
        jump: Jump,
        end: End,
        // ----
        fork: Fork,
        par: Par,
        chain: Chain,
        await: Await,
        // ----
        var: variable,
        // ----
        setI: setImage,
        tweenI: tweenImage,
        closeI: closeImage,
        // ----
        setA: setAudio,
        tweenA: fadeAudio,
        closeA: closeAudio,
        // ----
        sel: selection,
        selEnd,
        // ----
        name,
        text,
        icon,
        backlog,
        preview,
        // ----
        wait,
        video,
        unlock,
        shake,
        punch
    }) as const

// 文本:text
// 名称:name
// 目标:target
// 文件:file
// 坐标:xyzwh
// 时间:duration
// 缓动:transition
