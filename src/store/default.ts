import { Reactive } from "micro-reactive"

// 确保程序运行所需的键值,如新增依赖变量,需要在这里添加默认值
const defaultStore = {
    system: {
        name: "default",
        version: "1",
        width: 2560,
        height: 1440,
        mode: "auto",
    },
    config: {
        GolbalVolume: 1,
        BGMVolume: 1,
        SEVolume: 1,
        ClipVolume: 1,
        language: 'zh-CN'
    },
    save: {
        global: {},
        individual: {}
    },
    user: {

    }
}

// tag:考虑global放info,graphic,variable这些,archive放list,variable,readed(这词拼写错误但是意思到了)
// 'readed'似乎可以是'seen'

// archive中应包含内容按照之前有 previewpic index text 具体名称修改待考虑
type IniKV = Record<string, string | number | boolean>
type IndividualSaveData = Dictionary

// save-individual:把list换成map，这样就不用初始化了
type Save = { global: Dictionary, individual: Record<number, IndividualSaveData> }
type Store = Reactive<{
    system: typeof defaultStore['system'],
    config: typeof defaultStore['config'] & IniKV,
    save: Save,
    user: typeof defaultStore['user'] & IniKV
}>

export default defaultStore

export type { IniKV, Store }