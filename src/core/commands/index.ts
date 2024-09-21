import { Command } from "../Command"
import { Continue, End, Jump } from "./scripts/!"

export const commands: Record<string, Command> = {
    continue: Continue,
    jump: Jump,
    end: End
}

// 文本:text
// 名称:name
// 目标:target
// 文件:file
// 坐标:xyzwh
// 时间:duration
// 缓动:transition