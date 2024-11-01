import type { Accessor, EffectFunction, EffectOptions, Setter, SignalOptions } from 'solid-js'
import { createEffect, createRoot, createSignal, onCleanup } from 'solid-js'

// tag:micro-reactive的effect是不受solidjs控制的
// 如果在局部组件createEffect全局变量,由于组件可能重新渲染,createEffect会被重复记录和执行
// 所以更喜欢使用solidjs原生的signal来存储基本类型的局部变量,并且合并get set方法以获得统一
// 而对于object类型,则使用useReactive享受任意解构带来的好处

// type Primitive = string | number | boolean | symbol | bigint | null | undefined
// T extends Primitive useSignal(0) 这样会把T约束到0而不是number,不知道如何处理

type Signal<T> = Accessor<T> & Setter<T>
// function useSignal(value: string, options?: SignalOptions<string>): Accessor<string> & Setter<string>
// function useSignal(value: number, options?: SignalOptions<number>): Accessor<number> & Setter<number>
// function useSignal(value: boolean, options?: SignalOptions<boolean>): Accessor<boolean> & Setter<boolean>
// function useSignal(value: symbol, options?: SignalOptions<symbol>): Accessor<symbol> & Setter<symbol>
// function useSignal(value: bigint, options?: SignalOptions<bigint>): Accessor<bigint> & Setter<bigint>
function useSignal<T>(value: T, options?: SignalOptions<T>): Signal<T> {
    const [get, set] = createSignal(value, options)

    return ((value) => {
        if (value === undefined) return get()
        else return set(value)
    }) as Signal<T>
}

// 可以主动解除监听的createEffect,解除操作对micro-reactive创建的变量无效
function useEffect<Next>(fn: EffectFunction<undefined | NoInfer<Next>, Next>): () => void
function useEffect<Next, Init = Next>(
    fn: EffectFunction<Init | Next, Next>,
    value: Init,
    options?: EffectOptions & {
        render?: boolean
    }
): () => void
function useEffect(
    fn: EffectFunction<unknown, unknown>,
    value?: unknown,
    options?: EffectOptions & {
        render?: boolean
    }
) {
    const dispose = createRoot((dispose) => {
        createEffect(fn, value, options)
        return dispose
    })

    onCleanup(() => dispose())
    return dispose
}

export { type Signal, useSignal, useEffect }
