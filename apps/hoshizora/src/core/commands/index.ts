import { achievement } from './script/achievement'
import { closeaudio, fadeaudio, setaudio } from './script/audio'
import { backlog } from './script/backlog'
import { blind } from './script/blind'
import { addchoice, showchoices } from './script/choice'
import { check, click } from './script/click'
import { closeimage, setimage, tweenimage } from './script/image'
import { punch, shake } from './script/shake'
import { icon, name, text, textbox, textpreview } from './script/textbox'
import { unlock } from './script/unlock'
import { video } from './script/video'
import { wait } from './script/wait'
import { Continue, End, Jump, label } from './system/branch'
import { Chain, Fork, Par } from './system/schedule'

// 高阶命令循环引用commands,所以这里使用lazy初始化
export const commands = () =>
    ({
        // ----
        continue: Continue,
        jump: Jump,
        end: End,
        label,
        // ----
        fork: Fork,
        par: Par,
        chain: Chain,
        // ----
        achievement,
        // ----
        setimage,
        tweenimage,
        closeimage,
        // ----
        setaudio,
        fadeaudio,
        closeaudio,
        // ----
        addchoice,
        showchoices,
        // ----
        name,
        text,
        icon,
        backlog,
        textpreview,
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
