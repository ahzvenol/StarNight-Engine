// const Data = {
//     $archive: {},
//     $backlog: {},
//     $lifecycle: "lifecycle",
//     $original: "original",
//     $stage: "stage",
//     $config: "???",
//     $sleep: "state.bridge.sleep",
//     $setTimeout: "state.bridge.setTimeout"
// }


// type Command = {
//     Load(arg0: Dictionary): Promise<void> | void
//     Init(arg0: Dictionary): Promise<void> | void
//     Normal(arg0: Dictionary): Promise<void> | void
//     Fast(arg0: Dictionary): Promise<void> | void
// }

// const commands: Dictionary<Command> = {}

const commandPrototype = {}

Object.keys(commands).forEach(commandKey => { commands[commandKey].__proto__ = commandPrototype })

const PutPicture: Command = {
    async Load() {

    },
    Init() {

    },
    Normal() {

    },
    Fast() {

    }
}

await PutPicture.Init({})

const EditTextArea: Command = {
    Load,
}

type Book = Array<Array<Dictionary>>

declare const book: Book

// 实现了命令内部的幕级中断,只需要返回一个Promise.reject()即可
const commandForRunExample = book[0]
    .map(i => async () => commands[i['@']]['R'](i))
    .reduce<Promise<void>>((p, e) => p.then(() => e()), Promise.resolve())
