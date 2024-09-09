import { language } from "@/translations"
import { Reactive } from "micro-reactive"

// 确保程序运行所需的键值,如新增依赖变量,需要在这里添加默认值
const systemDefaultStore = {
    system: {
        name: "default",
        version: "1",
        width: 2560,
        height: 1440,
        mode: "auto" as "auto" | "full",
    },
    config: {
        GolbalVolume: 1,
        BGMVolume: 1,
        SEVolume: 1,
        ClipVolume: 1,
        UISEVolume: 1,
        language: 'zh-CN' as keyof typeof language
    },
    save: {
        global: {} as Dictionary,
        individual: {} as Record<number, IndividualSaveData>
    },
    user: {

    }
}

// tag:考虑global放info,graphic,variable这些,archive放list,variable,readed(这词拼写错误但是意思到了)
// 'readed'似乎可以是'seen'
// archive中应包含内容按照之前有 previewpic index text 具体名称修改待考虑

type IniKV = Record<string, string | number | boolean>
type IndividualSaveData = Dictionary

// & IniKV会丢失类型检查,所以不在类型上书写它
// type Store = Reactive<{
//     system: typeof systemDefaultStore['system'],
//     config: typeof systemDefaultStore['config'],
//     save: typeof systemDefaultStore['save'],
//     user: typeof systemDefaultStore['user']
// }>
type Store = Reactive<typeof systemDefaultStore>

export default systemDefaultStore

export type { IniKV, Store, IndividualSaveData }