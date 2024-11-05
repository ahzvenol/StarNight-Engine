import type { CommandRunFunction } from '@/core/type'
import { noInit } from '@/core/macro'
import { Y } from '@/utils/FPUtil'
import { useSignal } from '@/utils/Reactive'
import { arrayToInterval, intervalToArray } from '@/utils/zipNumArray'

// 跨幕环境变量name,无副作用
// 存在依赖变量的"文字播放速度"

export const textView = useSignal('')
export const textWasReadView = useSignal(false)
export const textSave = useSignal('')

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

export const TextHooks = {
    beforeInit: () => (textView(''), textWasReadView(false), textSave('')),
    beforeActStart: () => (textView(''), textWasReadView(false), textSave(''))
}

export const nameView = useSignal('')

const name: CommandRunFunction<{ name: string }> =
    () =>
    ({ name }) => {
        nameView(name)
    }

export const Name = name

export const NameHooks = { beforeInit: () => nameView('') }
