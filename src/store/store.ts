import type { Resource } from 'solid-js'
import type { ReactiveStore, Store } from './default'
import { cloneDeep, debounce, toMerged } from 'es-toolkit'
import localforage from 'localforage'
import { createEffect, createResource, on } from 'solid-js'
import { unwrap } from 'solid-js/store'
import { log } from '@/utils/logger'
import { useReactive } from '@/utils/solid/useReactive'
import systemDefaultStore from './default'

async function createStore() {
    const userConfig = {}

    const userDefaultStore = toMerged(systemDefaultStore, userConfig)

    localforage.config({ name: userDefaultStore.system.key })

    // 提前初始化storage避免getItem返回null的方法并不可行,因为setItem也是异步操作

    // 暂时不知道存起来有什么用,或许对比版本号更新一些东西的时候有用
    // 这部分不能和config放在一起,因为config的特点是用户配置覆盖默认配置
    // 应该不会有需求动态更改画布大小的吧

    // localforage.getItem可能返回null,Object.assign遇到一个null不会有问题,parseIni遇到问题会抛异常
    // 合并配置文件和数据库内的配置，数据库中的配置会覆盖掉配置文件的默认配置
    const config = (await localforage.getItem<Store['config']>('config')) || {}

    // 响应式绑定不能超过一级,所以数据结构仍然需要预先初始化
    // 多层空调用报错会导致程序崩溃,foo.bar.baz is not a function
    const save = await localforage.getItem<Store['save']>('save')

    const local = (await localforage.getItem<Store['local']>('local')) || {}

    // 这里是默认配置与storage配置之间的关系逻辑
    const store = useReactive({
        system: userDefaultStore.system,
        config: toMerged(userDefaultStore.config, config),
        save: save || userDefaultStore.save,
        local: toMerged(userDefaultStore.local, local)
    })

    Object.keys(store()).forEach((key) => {
        createEffect(
            on(
                () => JSON.stringify(store[key as keyof ReactiveStore]()),
                debounce(() => {
                    localforage.setItem(key, unwrap(store[key as keyof ReactiveStore]()))
                    log.info(`写入本地存储:${key}`)
                }, 100)
            )
        )
    })

    log.info('Store初始化完毕:', store())

    // 响应式绑定最终还是会修改原始对象,所以需要深度克隆避免默认配置被修改
    return { userDefaultStore: () => cloneDeep(userDefaultStore), store }
}

const storePackage = createStore()

// 各模块对store数据的依赖关系通过使用storePromise定义在effects中
const storePromise = storePackage.then(({ store }) => store)

// 重置三件套
const clearStorage = () =>
    storePackage.then(({ userDefaultStore, store }) => localforage.clear().then(() => store(userDefaultStore())))
const resetConfig = () => storePackage.then(({ userDefaultStore, store }) => store.config(userDefaultStore().config))
const clearSave = () => storePackage.then(({ userDefaultStore, store }) => store.save(userDefaultStore().save))

const [store] = createResource(async () => await storePromise)

export default store as Resource<ReactiveStore>

export { clearSave, clearStorage, resetConfig, storePromise }
