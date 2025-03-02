import './effect'
import type { ReactiveStore, Store } from './default'
import { debounce, toMerged } from 'es-toolkit'
import localforage from 'localforage'
import { createEffect, on } from 'solid-js'
import { unwrap } from 'solid-js/store'
import { log } from '@/utils/logger'
import { useReactive } from '@/utils/solid/useReactive'
import { customDefaultStore } from './custom'
import { systemDefaultStore } from './default'

async function createStore() {
    localforage.config({ name: (await customDefaultStore).system.key })

    const config = (await localforage.getItem<Store['config'] | null>('config')) || {}
    const global = (await localforage.getItem<Store['global'] | null>('global')) || {}
    const local = (await localforage.getItem<Store['local'] | null>('local')) || {}
    const extra = (await localforage.getItem<Store['extra'] | null>('extra')) || {}

    // 这里是默认配置与storage配置之间的关系逻辑
    const store = useReactive(toMerged(systemDefaultStore, { config, global, local, extra }))

    return store
}

// 各模块对store数据的依赖关系通过使用onStoreReady定义在effects中
export const onStoreReady = createStore()

onStoreReady.then((store) =>
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
)

onStoreReady.then((store) => {
    log.info('Store初始化完毕:', store())
})
