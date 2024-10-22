import { Command } from '../Command'
import { Audio } from './hoshizora/audio'
import { Audio as OnlyLifeCycle0 } from './script/audio'
import { Say } from './hoshizora/say'
import { Continue, End, Jump } from './script/!'
import { Backlog } from './script/backlog'
import { Name, Text } from './script/textbox'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const commands: Record<string, Command<any>> = {
    continue: Continue,
    jump: Jump,
    end: End,
    backlog: Backlog,
    name: Name,
    text: Text,
    say: Say,
    audio: Audio,
    OnlyLifeCycle0
}

// 文本:text
// 名称:name
// 目标:target
// 文件:file
// 坐标:xyzwh
// 时间:duration
// 缓动:transition
