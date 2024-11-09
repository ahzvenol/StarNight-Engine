import type { CommandRunFunction } from '@/core/type'
import { noInit } from '@/core/macro'
import { Scope, useAutoResetSignal } from '@/core/useScopeSignal'
import { Y } from '@/utils/FPUtil'
import { arrayToInterval, intervalToArray } from '@/utils/zipNumArray'

// 跨幕环境变量name,无副作用
// 存在依赖变量的"文字播放速度"

export const textView = useAutoResetSignal(() => '', Scope.Act)
export const textWasReadView = useAutoResetSignal(() => false, Scope.Act)
export const textSave = useAutoResetSignal(() => '', Scope.Act)

const text: CommandRunFunction<{ text: string }> =
    ({ index, store, timer, variables: { global } }) =>
    ({ text }) => {
        textSave(text)
        const origin = intervalToArray(global.segment())
        if (!origin.includes(index)) {
            global.segment(arrayToInterval([...origin, index]))
        } else {
            textWasReadView(true)
        }

        return Y<string, Promise<void>>((rec) => (str) => {
            return timer
                .delay(0)
                .then(() => textView((text) => text + str.substring(0, 1)))
                .then(() => timer.delay(store.config.TextSpeed * 100))
                .then(() => {
                    if (str.length >= 1) return rec(str.substring(1))
                })
        })(text)
    }

export const Text = noInit(text)

export const nameView = useAutoResetSignal(() => '', Scope.Act)

const name: CommandRunFunction<{ name: string }> =
    () =>
    ({ name }) => {
        nameView(name)
    }

export const Name = name
