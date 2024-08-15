import { ObjectUtils } from "../util"

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
    Load(arg0: Dictionary): Promise<void> | void
    Init(arg0: Dictionary): Promise<void> | void
    Normal(arg0: Dictionary): Promise<void> | void
    Fast(arg0: Dictionary): Promise<void> | void
}

type Command = (context: GameContext) => CommandContent

const commands: Dictionary<Command> = {}

const init = (context: GameContext) => ObjectUtils.map(commands)(([key, command]) => [key, command(context)])