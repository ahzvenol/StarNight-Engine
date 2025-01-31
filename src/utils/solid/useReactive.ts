import type { Reactive } from 'micro-reactive'
import type { StoreNode } from 'solid-js/store'
import { useReactive as useMicroReactive } from 'micro-reactive'
import { createMutable } from 'solid-js/store'

// 通过solid的store对象实现响应式,通过micro-reactive实现任意解构和函数风格
export function useReactive<T extends StoreNode>(value: T): Reactive<T> {
    return useMicroReactive(createMutable(value))
}
