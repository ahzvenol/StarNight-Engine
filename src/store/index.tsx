import { type Reactive, useEffect, useReactive } from "micro-reactive"
import { type Resource, createResource, on } from "solid-js"
import localforage from "localforage"
import { parse } from 'js-ini'
import logger from "@/utils/Logger"
import { iniDemo } from "@/assets/ini"
import { merge } from "es-toolkit"

// tag:考虑global放info,graphic,variable这些,archive放list,variable,readed(这词拼写错误但是意思到了)
// 'readed'似乎可以是'seen'
// archive中应包含内容按照之前有 previewpic index text 具体名称修改待考虑
type IndividualSaveData = Dictionary
// save-individual:把list换成map，这样就不用初始化了
type Save = { global: Dictionary, individual: Record<number, IndividualSaveData> }

type Store = Reactive<{ system: typeof sys, save: Save, config: Dictionary }>

// todo:响应式绑定不能超过一级,所以数据结构仍然需要预先初始化
// 不过由于修改状态时并不加载依赖状态的页面,所以问题大概不算严重
// 看起来调用报错会导致程序崩溃,这样就比较麻烦
const ini = parse(iniDemo) as Record<string, Record<string, string | number | boolean>>

const { info, graphic, config: cfg } = ini

const sys = { info, graphic }

logger.info("配置文件解析完毕:", ini)

const gameName = info['name']?.toString() || "default"

const createStore = async () => {
    localforage.config({ name: gameName })

    // 暂时不知道存起来有什么用,或许对比版本号更新一些东西的时候有用
    // 这部分不能和config放在一起,因为config的特点是用户配置覆盖默认配置
    // 应该不会有需求动态更改画布大小的吧
    const system = await localforage.getItem<typeof sys>('system').then(res => res || {}).then(res => merge(res, sys))

    // localforage.getItem可能返回null,Object.assign遇到一个null不会有问题,parseIni遇到问题会抛异常
    // 合并配置文件和数据库内的配置，数据库中的配置会覆盖掉配置文件的默认配置
    const config = await localforage.getItem<Object>('config').then(res => res || {}).then(res => merge(cfg, res))

    const save = await localforage.getItem<Save>('save').then(res => res || { global: {}, individual: {} })

    const store = useReactive({ system, save, config })

    // @ts-ignore
    Object.keys(store()).forEach(key => useEffect(() => { localforage.setItem(key, store[key]()) }))

    // 绑定对应的audio
    useEffect(on(store.config["GolbalVolume"], () => { }))
    useEffect(on(store.config["BGMVolume"], () => { }))
    useEffect(on(store.config["SEVolume"], () => { }))
    useEffect(on(store.config["ClipVolume"], () => { }))

    // 应用其他设置
    useEffect(() => { })

    logger.info("Store初始化完毕", store())

    return store
}

const [store] = createResource(async () => await createStore())

export default store as Resource<Store>

export type { Store }

