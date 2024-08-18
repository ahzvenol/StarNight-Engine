import { type Reactive, useEffect, useReactive } from "micro-reactive"
import { type Resource, createResource } from "solid-js"
import localforage from "localforage"
import { parse as parseIni } from 'js-ini'

const iniDemo = `
[info]
name=demo

[graphics]
width=1280
height=720
mode=auto

[variable]
v1=1
v2=""
v3=true

`

// fix:global意思是全局存档,需要考虑消歧义
// tag:考虑global放info,graphics,variable这些,archive放list,variable,readed(这词拼写错误但是意思到了)
// 'readed'似乎可以是'seen'
// tag:archive:把list换成map，这样就不用初始化了
// archive中应包含内容按照之前有 previewpic index text 具体名称修改待考虑
type Save = { global: Dictionary, individual: Record<number, Dictionary> }
type Store = Reactive<{ save: Save, config: Dictionary }>

const createStore = async () => {
    localforage.config({ name: "GameName" })

    // localforage.getItem可能返回null,Object.assign遇到一个null不会有问题,parseIni遇到问题会抛异常
    // 合并配置文件和数据库内的配置，数据库中的配置会覆盖掉配置文件的默认配置
    const config = await localforage.getItem<Object>('config').then(res => Object.assign(parseIni(iniDemo), res)) || {}
    // const global = await localforage.getItem<Object>('global') || {}
    const save = await localforage.getItem<Save>('save') || {}

    const store = useReactive({ save, config })

    useEffect(() => { localforage.setItem('config', store['config']()) })
    // useEffect(() => { localforage.setItem('global', store['global']()) })
    useEffect(() => { localforage.setItem('save', store['save']()) })

    // 绑定对应的audio
    useEffect(() => { })
    // 应用其他设置
    useEffect(() => { })

    console.log(store())
    // console.log(store.config['graphics']())

    return store
}


const [store] = createResource(async () => await createStore())


// console.log(IniParser.parse(""))
// console.log(parse(iniDemo))
// console.log(useReactive(IniParser.parse(iniDemo)))
// setTimeout(() => console.log(store.state), 1000)
// setTimeout(() => console.log(store()), 1000)


export default store as Resource<Store>

export type { Store }

