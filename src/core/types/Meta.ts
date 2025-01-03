/* eslint-disable @typescript-eslint/no-unsafe-function-type */

// 通用类型,表示一个附加了信息的函数
export interface MetaFunction {
    meta: Record<string, unknown>
    apply: Function
}
