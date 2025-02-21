/* eslint-disable */

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
    (value: Partial<T>, patch: boolean): void
}

/**
 * 响应式对象
 * @public
 */
export type Reactive<T> = Signal<T> &
    (T extends object
        ? {
              readonly [key in keyof T]: Reactive<T[key]>
          } & Readonly<T>
        : {})

/**
 * 只读响应式对象
 * @public
 */
export type ReadonlyReactive<T> = Getter<T> &
    (T extends object
        ? {
              readonly [key in keyof T]: ReadonlyReactive<T[key]>
          } & Readonly<T>
        : {})

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
    path: string
    get: Getter<T>
    set: Setter<T> | ((value: Partial<T>, patch: boolean) => void)
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
export function createAccessor(path: string) {
    const segments = path.split('.')
    return {
        get() {
            return path ? segments.reduce((obj, k) => obj[k], state) : state
        },
        set<T>(value: T, patch = false) {
            let i = 0,
                obj = state
            for (i = 0; i < segments.length - 1; i++) {
                obj = obj[segments[i]]
            }
            patch && typeof value === 'object' && value !== null
                ? Object.assign(obj[segments[i]], value)
                : (obj[segments[i]] = value)
        }
    }
}

/**
 * symbol类型的空值，用于区分读取和写入操作
 */
const NULL = Symbol('NULL') as any

/**
 * 读取值
 * @param option - 信号函数的选项
 * @returns 读取的值
 */
export function read<T>(option: Option<T>): T {
    const { get } = option
    return get()
}

/**
 * 写入值
 * @param option - 信号函数的选项
 * @param value - 写入的值
 * @param patch - 是否为局部更新
 */
export function write<T>(option: Option<T>, value: T, patch: boolean): void {
    const { set } = option
    set(value, patch)
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
    function signal<T>(value: Partial<T>, patch: boolean): void
    function signal(value = NULL, patch = false) {
        return NULL === value ? read(option) : write(option, value, patch)
    }
    return signal
}

/**
 * 创建响应式对象
 * @param path - 响应式对象的路径
 * @param parent - 响应式对象的父级option
 * @returns 响应式对象
 */
export function createReactive<T>(path: string, parent: Option<any> | null): Reactive<T> {
    const opt: Option<T> = {
        reactiveMap: new Map(),
        parent,
        path,
        ...createAccessor(path)
    }
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
            const react = createReactive(`${path}.${String(key)}`, opt)
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
    return createReactive(key, null)
}
