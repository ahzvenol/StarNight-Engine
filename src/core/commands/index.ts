import { ObjectUtils } from "../../util"

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
    // Load(arg0: ObjectMap): Promise<void> | void
    // Init(arg0: ObjectMap): Promise<void> | void
    // Normal(arg0: ObjectMap): Promise<void> | void
    // Fast(arg0: ObjectMap): Promise<void> | void
    Load:Function1<ObjectMap,Promise<void> | void>
    Init:Function1<ObjectMap,Promise<void> | void>
    Normal:Function1<ObjectMap,Promise<void> | void>
    Fast:Function1<ObjectMap,Promise<void> | void>
}

type Command = (context: GameContext) => CommandContent

const commands: ObjectMap<Command> = {}

const newCommands = (context: GameContext) => ObjectUtils.map(commands)(([key, command]) => [key, command(context)])

export {newCommands}