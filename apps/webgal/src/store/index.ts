import type { ReactiveStore, Store } from './default'
import { debounce, toMerged } from 'es-toolkit'
import localforage from 'localforage'
import { useReactive } from 'micro-reactive-solid'
import { createEffect, on } from 'solid-js'
import { unwrap } from 'solid-js/store'
import { log } from '@/utils/Logger'
import { CustomDefaultStore } from './custom'
import { SystemDefaultStore } from './default'

export const store = useReactive<Store>(null as unknown as Store)

async function initializeStore() {
    localforage.config({ name: (await CustomDefaultStore()).system.key })

    const config = (await localforage.getItem<Store['config'] | null>('config')) || {}
    const global = (await localforage.getItem<Store['global'] | null>('global')) || {}
    const local = (await localforage.getItem<Store['local'] | null>('local')) || {}
    const extra = (await localforage.getItem<Store['extra'] | null>('extra')) || {}

    store(toMerged(SystemDefaultStore(), { config, global, local, extra }))

    // 自动同步本地存储
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

    return store
}

// 各模块对store数据的依赖关系通过使用onStoreReady定义在effects中
export const onStoreReady = initializeStore()

onStoreReady.then((store) => log.info('Store初始化完毕:', store()))
