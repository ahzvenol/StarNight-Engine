import { Continue, End, Jump } from './script/!'
import { audio } from './script/audio'
import { backlog } from './script/backlog'
import { removeImage, setImage, tweenImage } from './script/image'
import { selection, selEnd } from './script/selection'
import { punch, shake } from './script/shake'
import { name, text } from './script/textbox'
import { unlock } from './script/unlock'
import { variable } from './script/variable'
import { video } from './script/video'
import { wait } from './script/wait'

export const commands = {
    continue: Continue,
    jump: Jump,
    end: End,
    var: variable,
    image: setImage,
    tween: tweenImage,
    close: removeImage,
    sel: selection,
    selEnd,
    wait,
    backlog,
    name,
    text,
    audio,
    video,
    unlock,
    shake,
    punch
} as const

export type Commands = typeof commands

export type CommandKeys = keyof Commands

export type CommandArgs<T extends CommandKeys> = Parameters<ReturnType<Commands[T]>>[0]
// 文本:text
// 名称:name
// 目标:target
// 文件:file
// 坐标:xyzwh
// 时间:duration
// 缓动:transition
