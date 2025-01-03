import { closeAudio, setAudio } from './script/audio'
import { backlog } from './script/backlog'
import { Continue, End, Jump } from './script/branch'
import { closeImage, setImage, tweenImage } from './script/image'
import { Await, Fork } from './script/schedule'
import { selection, selEnd } from './script/selection'
import { punch, shake } from './script/shake'
import { name, preview, text } from './script/textbox'
import { unlock } from './script/unlock'
import { variable } from './script/variable'
import { video } from './script/video'
import { wait } from './script/wait'

export const commands = {
    continue: Continue,
    jump: Jump,
    end: End,
    fork: Fork,
    await: Await,
    var: variable,
    image: setImage,
    tween: tweenImage,
    closeI: closeImage,
    audio: setAudio,
    closeA: closeAudio,
    sel: selection,
    selEnd,
    wait,
    backlog,
    name,
    text,
    video,
    unlock,
    shake,
    punch,
    preview
} as const

// 文本:text
// 名称:name
// 目标:target
// 文件:file
// 坐标:xyzwh
// 时间:duration
// 缓动:transition
