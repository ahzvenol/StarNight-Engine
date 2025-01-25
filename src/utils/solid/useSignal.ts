import type { Accessor, Setter, SignalOptions } from 'solid-js'
import { createSignal } from 'solid-js'

// tag:micro-reactive的effect是不受solidjs控制的
// 如果在局部组件createEffect全局变量,由于组件可能重新渲染,createEffect会被重复记录和执行
// 所以更喜欢使用solidjs原生的signal来存储基本类型的局部变量,并且合并get set方法以获得统一
// 而对于复杂的数据解构,则使用useReactive享受任意解构带来的好处

// T extends Primitive useSignal(0) 这样会把T约束到0而不是number,不知道如何处理

export type Signal<T> = Accessor<T> & Setter<T>
// function useSignal(value: string, options?: SignalOptions<string>): Accessor<string> & Setter<string>
// function useSignal(value: number, options?: SignalOptions<number>): Accessor<number> & Setter<number>
// function useSignal(value: boolean, options?: SignalOptions<boolean>): Accessor<boolean> & Setter<boolean>
// function useSignal(value: symbol, options?: SignalOptions<symbol>): Accessor<symbol> & Setter<symbol>
// function useSignal(value: bigint, options?: SignalOptions<bigint>): Accessor<bigint> & Setter<bigint>
export function useSignal<T>(value: T, options?: SignalOptions<T>): Signal<T> {
    const [get, set] = createSignal(value, options)

    return ((value) => {
        if (value === undefined) return get()
        else return set(value)
    }) as Signal<T>
}
