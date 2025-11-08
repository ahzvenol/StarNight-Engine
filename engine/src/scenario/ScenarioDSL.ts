import type {
    GameScript,
    GameRuntimeContext,
    CommandTagBlocking,
    CommandTagDynamic,
    CommandTagNonBlocking,
    StandardBlockingCommand,
    StandardCommand,
    StandardDynamicCommand,
    StandardNonBlockingCommand
} from '@starnight/core'

declare global {
    interface Window {
        $context: GameRuntimeContext
    }
}

export const $debugger = Symbol()

export type $debugger = typeof $debugger

export type GameScenarioDSL = () => AsyncGenerator<number | $debugger, unknown, unknown>

const GlobalEffectPromises: Array<Promise<unknown>> = []

export function* ScenarioDSL(DSL: GameScenarioDSL, debug: boolean = false): GameScript {
    let value: unknown
    let index: number
    let done: boolean | undefined
    const scenario = DSL()

    while (!done) {
        yield function* (context: GameRuntimeContext) {
            window.$context = context
            while (true) {
                const current = (yield scenario.next(value)) as IteratorResult<number | $debugger, unknown>
                done = current.done
                if (current.done) {
                    index = NaN
                    break
                } else if (debug === true) {
                    if (current.value === $debugger) {
                        index = NaN
                        debug = false
                        break
                    }
                } else if (typeof current.value === 'number') {
                    index = current.value
                    break
                }
            }
            yield Promise.all(GlobalEffectPromises)
            GlobalEffectPromises.length = 0
            return index
        }
    }
    return undefined
}

export function Api<T, R>(fn: StandardDynamicCommand<T, R>): ((arg0: T) => R) & CommandTagDynamic
export function Api<T, R>(fn: StandardNonBlockingCommand<T, R>): ((arg0: T) => R) & CommandTagNonBlocking
export function Api<T, R>(fn: StandardBlockingCommand<T, R>): ((arg0: T) => R) & CommandTagBlocking
export function Api<T, R>(fn: StandardCommand<T, R>): (arg0: T) => R {
    return (args) => {
        const res = fn(args)($context)
        if (res instanceof Promise) GlobalEffectPromises.push(res)
        return res
    }
}

export function GenericApi<T, R>(fn: StandardCommand<T, R>): (arg0: T) => R {
    return (args) => {
        const res = fn(args)($context)
        if (res instanceof Promise) GlobalEffectPromises.push(res)
        return res
    }
}

export const TagDynamic = <F>(fn: F): F & CommandTagDynamic => fn as F & CommandTagDynamic

export const TagNonBlock = <F>(fn: F): F & CommandTagNonBlocking => fn as F & CommandTagNonBlocking

export const TagBlocking = <F>(fn: F): F & CommandTagBlocking => fn as F & CommandTagBlocking

export type FilterDynamicApis<T> = {
    [K in keyof T as T[K] extends CommandTagDynamic ? K : never]: T[K]
}

export type FilterBlockingApis<T> = {
    [K in keyof T as
    T[K] extends CommandTagBlocking
        ? (T[K] extends CommandTagDynamic | CommandTagNonBlocking ? never : K)
        : never
    ]: T[K]
}

export type FilterNonBlockingApis<T> = {
    [K in keyof T as
    T[K] extends CommandTagNonBlocking
        ? (T[K] extends CommandTagDynamic | CommandTagBlocking ? never : K)
        : never
    ]: T[K]
}
