/* eslint-disable @typescript-eslint/no-unsafe-function-type */

// 通用类型,表示一个附加了信息的函数
export interface MetaFunction {
    meta?: Record<string, unknown>
    apply: Function
}

// 通用类型,启用/禁用
export enum SwitchState {
    Disabled = 0,
    Enabled = 1
}

// 通用类型,表示永远不会失败的Promise
export type NeverFailingPromise<T> = Promise<T>
