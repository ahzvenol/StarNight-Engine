/* eslint-disable */
import { property } from 'es-toolkit/compat'

/**
 * 读取值的函数
 * @public
 */
export type Getter<T> = () => T

/**
 * 写入值的函数
 * @public
 */
export type Setter<T> = (value: T) => void

/**
 * 信号函数
 * @public
 */
export interface Signal<T> {
    (): T
    (value: T): void
}

/**
 * 响应式对象
 * @public
 */
export type Reactive<T> = Signal<T> &
  (T extends object
    ? { readonly [key in keyof T]: Reactive<T[key]> } & (T extends Array<any> ? Array<unknown> : {})
    : {});

/**
 * 只读响应式对象
 * @public
 */
export type ReadonlyReactive<T> = Getter<T> &
  (T extends object ? { readonly [key in keyof T]: ReadonlyReactive<T[key]> } : {});

/**
 * 响应式对象的内部值
 * @public
 */
export type ReactiveType<T> = T extends Reactive<infer V> ? V : never

/**
 * 响应式对象的Map集合
 */
export type ReactiveMap<T> = Map<keyof T, Reactive<T[keyof T]>>

/**
 * 响应式对象的选项
 */
export type Option<T> = {
    reactiveMap: ReactiveMap<T>
    parent: Option<T> | null
    path: PropertyKey[]
    get: Getter<T>
    set: Setter<T>
}

export const state: any = {}

/**
 * 获取唯一 id
 */
export const getId = (
    (id = 0) =>
    () =>
        String(id++)
)()

/**
 * 创建访问器对象
 * @public
 * @param path - 路径
 * @returns 访问器对象
 */
export function createAccessor(path: PropertyKey[]) {
    return {
        get() {
            return property(path)(state)
        },
        set<T>(value: T) {
            const i = path.at(-1)!
            const obj = property(path.slice(0, -1))(state)
            obj[i] = value
        }
    }
}

/**
 * 创建信号函数，
 * 信号函数没有参数时为读取操作，
 * 信号函数有参数时为写入操作。
 * @param option - 信号函数的选项
 * @returns 信号函数
 */
export function createSignal<T>(option: Option<T>): Signal<T> {
    function signal<T>(): T
    function signal<T>(value: T): void
    function signal(value?: T) {
        return value === undefined ? option.get() : option.set(value)
    }
    return signal
}

/**
 * 创建响应式对象
 * @param path - 响应式对象的路径
 * @param parent - 响应式对象的父级option
 * @returns 响应式对象
 */
export function createReactive<T>(path: PropertyKey[], parent: Option<any> | null): Reactive<T> {
    const opt: Option<T> = { reactiveMap: new Map(), parent, path, ...createAccessor(path) }
    const signal = createSignal(opt)
    return new Proxy(signal, {
        get(target, key) {
            const value = opt.get()

            // 若属性的响应式对象已存在，直接返回
            const reactive = opt.reactiveMap.get(key as keyof T)
            if (reactive) return reactive

            // signal 函数上的属性
            const method = Reflect.get(target, key)
            if (method != void 0) return method

            // 非对象类型的值，不能索引出属性
            if (typeof value !== 'object' || value === null) return void 0

            // 对象本身的属性
            const property = Reflect.get(value as unknown as object, key)
            if (typeof property === 'function') {
                return (...args: any[]) => {
                    const ret = property.call(value, ...args)
                    target(value)
                    return ret
                }
            }

            // 若对象不存在then属性，则不允许新增then属性
            // 若初始化时就有then属性，则不受影响
            if (key === 'then') return void 0

            // 生成属性的响应式对象，缓存并返回
            const react = createReactive([...path, key], opt)
            opt.reactiveMap.set(key as keyof T, react as any)
            return react
        }
    }) as Reactive<T>
}

/**
 * 使用响应式对象
 * @public
 * @param value - 响应式对象的初始值
 * @returns 响应式对象
 */
export function useReactive<T>(value: T): Reactive<T> {
    const key = getId()
    state[key] = value
    return createReactive([key], null)
}
