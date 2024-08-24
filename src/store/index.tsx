import { merge } from "es-toolkit"
import { parse } from 'js-ini'
import localforage from "localforage"
import { useReactive, type Reactive } from "micro-reactive"
import { createEffect, createResource, on, type Resource } from "solid-js"

import { iniDemo } from "@/store/ini"
import { BGMConfigVolumeController, ClipConfigVolumeController, GolbalVolume, SEConfigVolumeController } from "@/store/AudioManager"
import logger from "@/utils/Logger"
import { lang } from "@/ui/translations"
import defaultStore, { IniKV } from "./default"

const getUserIni = async () => {
    const ini = parse(iniDemo) as Record<string, IniKV>

    const { info = {}, graphic = {}, config = {}, user = {} } = ini

    const system = { info, graphic }

    logger.info("配置文件解析完毕:", ini)

    localforage.config({ name: info['name']?.toString() })

    const iniObj = { system, config, user }

    const store = useReactive(merge(defaultStore, iniObj))
}

// const defaultStore = {
//     system, config: merge({ GolbalVolume: 1, BGMVolume: 1, SEVolume: 1, ClipVolume: 1, language: 'zh-CN' }, config),
//     save: { global: {}, individual: {} }, user
// }

// 重置三件套
// todo:实际上默认配置为merge(defaultStore, iniObj)
const clean = () => localforage.clear().then(() => store(defaultStore))
const resetConfig = () => store.config(defaultStore.config)
const cleanSave = () => store.save(defaultStore.save)

const createStore = async () => {
    // 暂时不知道存起来有什么用,或许对比版本号更新一些东西的时候有用
    // 这部分不能和config放在一起,因为config的特点是用户配置覆盖默认配置
    // 应该不会有需求动态更改画布大小的吧
    const system = await localforage.getItem<System>('system').then(res => merge(res || {}, defaultStore.system))

    // localforage.getItem可能返回null,Object.assign遇到一个null不会有问题,parseIni遇到问题会抛异常
    // 合并配置文件和数据库内的配置，数据库中的配置会覆盖掉配置文件的默认配置
    const config = await localforage.getItem<Object>('config').then(res => merge(defaultStore.config, res || {}))

    // 响应式绑定不能超过一级,所以数据结构仍然需要预先初始化
    // 多层空调用报错会导致程序崩溃,foo.bar.baz is not a function
    const save = await localforage.getItem<Save>('save').then(res => res || defaultStore.save)

    store.system(system)
    store.config(config)
    store.save(save)

    // 提前初始化避免getItem返回null的方法并不可行,因为setItem也是异步操作
    // @ts-ignore
    Object.keys(store()).forEach(key => createEffect(() => { localforage.setItem(key, store[key]()) }))

    // 绑定对应的audio
    createEffect(on(store.config["GolbalVolume"], () => GolbalVolume(store.config["GolbalVolume"]())))
    createEffect(on(store.config["BGMVolume"], () => BGMConfigVolumeController(store.config["BGMVolume"]())))
    createEffect(on(store.config["SEVolume"], () => SEConfigVolumeController(store.config["SEVolume"]())))
    createEffect(on(store.config["ClipVolume"], () => ClipConfigVolumeController(store.config["ClipVolume"]())))

    // 绑定语言
    // tag:这里好像控制流向出现了问题
    createEffect(on(lang, () => store.config["language"](lang())))

    // 应用其他设置
    createEffect(() => { })

    logger.info("Store初始化完毕:", store())

    return store
}

const storePromise = createStore()

const [storeResource] = createResource(async () => await storePromise)

export default storeResource as Resource<Store>

export { clean, cleanSave, resetConfig }

export type { Store, IndividualSaveData }


