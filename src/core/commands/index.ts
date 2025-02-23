import { achievement } from './script/achievement'
import { closeAudio, fadeAudio, setAudio } from './script/audio'
import { backlog } from './script/backlog'
import { check, click } from './script/click'
import { blind } from './script/hoshizora/blind'
// import { closeImage, setImage, tweenImage } from './script/image'
import { closeImage, setImage, tweenImage } from './script/hoshizora/image'
import { selection, selEnd } from './script/selection'
// import { punch, shake } from './script/shake'
import { punch, shake } from './script/shake'
import { Continue, End, Jump, sign } from './script/system/branch'
import { Await, Chain, Fork, Par } from './script/system/schedule'
import { icon, name, preview, text, textbox } from './script/textbox'
import { unlock } from './script/unlock'
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
        ach: achievement,
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
        sign,
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
        punch,
        click,
        check,
        textbox,
        blind
    }) as const

// 文本:text
// 名称:name
// 目标:target
// 文件:file
// 坐标:xyzwh
// 时间:duration
// 缓动:transition
