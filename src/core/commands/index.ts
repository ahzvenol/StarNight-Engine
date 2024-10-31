import { CommandRunFunction, GameHooks } from '../type'
import { Audio } from './hoshizora/audio'
import { SetImage } from './hoshizora/image'
import { Say } from './hoshizora/say'
import { Video } from './hoshizora/video'
import { Continue, End, Jump } from './script/!'
import { AudioHooks } from './script/audio'
import { BacklogHooks } from './script/backlog'
import { RemoveImage, SetImageHooks, TweenImage } from './script/image'
import { NameHooks, TextHooks } from './script/textbox'
import { TweenHooks } from './script/tween'
import { Variable } from './script/variable'
import { VideoHooks } from './script/video'
import { Wait } from './script/wait'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const _commands: Record<string, CommandRunFunction<any>> = {
    continue: Continue,
    jump: Jump,
    end: End,
    wait: Wait,
    var: Variable,
    // backlog: Backlog,
    // name: Name,
    // text: Text,
    say: Say,
    audio: Audio,
    image: SetImage,
    tween: TweenImage,
    close: RemoveImage,
    video: Video
}

export const hooks: Array<GameHooks> = [
    TextHooks,
    NameHooks,
    AudioHooks,
    BacklogHooks,
    SetImageHooks,
    TweenHooks,
    VideoHooks
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const commands = _commands as Record<keyof typeof _commands, CommandRunFunction<any>>

// 文本:text
// 名称:name
// 目标:target
// 文件:file
// 坐标:xyzwh
// 时间:duration
// 缓动:transition
