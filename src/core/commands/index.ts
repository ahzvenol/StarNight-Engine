import { CommandRunFunction, GameHooks } from '../Command'
import { Audio } from './hoshizora/audio'
import { SetImage } from './hoshizora/image'
import { Say } from './hoshizora/say'
import { Continue, End, Jump } from './script/!'
import { AudioHooks } from './script/audio'
import { BacklogHooks } from './script/backlog'
import { SetImageHooks } from './script/image'
import { NameHooks, TextHooks } from './script/textbox'
import { TweenHooks } from './script/tween'
import { Wait } from './script/wait'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const commands: Record<string, CommandRunFunction<any>> = {
    continue: Continue,
    jump: Jump,
    end: End,
    wait: Wait,
    // backlog: Backlog,
    // name: Name,
    // text: Text,
    say: Say,
    audio: Audio,
    image: SetImage
}

export const hooks: Array<GameHooks> = [TextHooks, NameHooks, AudioHooks, BacklogHooks, SetImageHooks, TweenHooks]

// 文本:text
// 名称:name
// 目标:target
// 文件:file
// 坐标:xyzwh
// 时间:duration
// 缓动:transition
