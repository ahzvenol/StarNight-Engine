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
type Store = Reactive<{ archive: Record<number, Object>, config: ObjectMap, global: ObjectMap }>

// assiginObject之后要合并ini中读取设置项和其他设置项会用得到的->好像用Object.assign就够了，用默认值和storage取出的值简单的合并即可

const createStore = async () => {
    localforage.config({ name: "GameName" })

    // const config = Object.assign(parseIni(iniDemo), await localforage.getItem<Object>('config') || {})
    // const global = await localforage.getItem<Object>('global') || {}
    // const archive = await localforage.getItem<Record<number, Object>>('archive') || []
    // localforage.getItem可能返回null,Object.assign遇到一个null不会有问题,parseIni遇到问题也会抛异常

    const config = await localforage.getItem<Object>('config').then(res => Object.assign(parseIni(iniDemo), res)) || {}
    const global = await localforage.getItem<Object>('global') || {}
    const archive = await localforage.getItem<Record<number, Object>>('archive') || {}

    const store = useReactive({ config, global, archive })

    useEffect(() => { localforage.setItem('config', store['config']()) })
    useEffect(() => { localforage.setItem('global', store['global']()) })
    useEffect(() => { localforage.setItem('archive', store['archive']()) })

    // 绑定对应的audio
    useEffect(() => { })
    // 应用其他设置
    useEffect(() => { })

    console.log(store())
    // console.log(store.config['graphics']())

    // 直接返回Reactive<T>会有奇怪的事情发生
    // 依赖库的bug修了,没事了
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

