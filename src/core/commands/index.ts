import { ObjectUtils } from "../../utils/ObjectUtils"

type GameContext = {
    $archive: {},
    $backlog: {},
    $lifecycle: "lifecycle",
    $original: "original",
    $stage: "stage",
    $config: "???",
    $sleep: "state.bridge.sleep",
    $setTimeout: "state.bridge.setTimeout"
}

type CommandContent = {
    // Load(arg0: Dictionary): Promise<void> | void
    // Init(arg0: Dictionary): Promise<void> | void
    // Normal(arg0: Dictionary): Promise<void> | void
    // Fast(arg0: Dictionary): Promise<void> | void
    Load:Function1<Dictionary,Promise<void> | void>
    Init:Function1<Dictionary,Promise<void> | void>
    Normal:Function1<Dictionary,Promise<void> | void>
    Fast:Function1<Dictionary,Promise<void> | void>
}

type Command = (context: GameContext) => CommandContent

const commands: Dictionary<Command> = {}

const newCommands = (context: GameContext) => ObjectUtils.map(commands)(([key, command]) => [key, command(context)])

// tag:如果遇到拆开到四种状态的函数,在这里使用state工具组合吧

export {newCommands}


// 文本:text
// 名称:name
// 目标:target
// 文件:file
// 坐标:xyzwh
// 时间:duration
// 缓动:transition

// 非预期参数
// 