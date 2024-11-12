import type { DynamicCommand, NonBlockingCommand } from '../../type'
import { inRange } from 'es-toolkit'
import { Scope, useAutoResetSignal } from '@/core/useScopeSignal'
import { Y } from '@/utils/FPUtil'
import { arrayToInterval, intervalToArray } from '@/utils/zipNumArray'
import { State } from '../../type'

// 跨幕环境变量name,无副作用
// 存在依赖变量的"文字播放速度"

export const textView = useAutoResetSignal(() => '', Scope.Act)
export const textWasReadView = useAutoResetSignal(() => false, Scope.Act)
export const textSave = useAutoResetSignal(() => '', Scope.Act)

export const text: DynamicCommand<{ text: string }> = ({ index, timer, state, store, variables: { global } }) =>
    function* ({ text }) {
        if (state === State.Init) return
        textSave(text)

        if (global.segment().some((i) => inRange(index, i[0], i[1] + 1))) {
            textWasReadView(true)
        } else {
            global.segment(arrayToInterval([...intervalToArray(global.segment()), index]))
        }
        yield* Y<string, Generator<Promise<void>, void, void>>(
            (rec) =>
                function* (str): Generator<Promise<void>, void, void> {
                    yield timer.delay(store.config.TextSpeed * 100)
                    textView((text) => text + str.charAt(0))
                    console.log(str)
                    if (str.length >= 1) yield* rec(str.slice(1))
                }
        )(text)
    }

export const nameView = useAutoResetSignal(() => '', Scope.Act)

export const name: NonBlockingCommand<{ name: string }> =
    () =>
    ({ name }) => {
        nameView(name)
    }
