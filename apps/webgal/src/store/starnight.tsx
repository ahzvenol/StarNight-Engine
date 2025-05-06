import type { GameAct, GameRuntimeContext, Reactive, StarNightInstance } from '@starnight/core'
import * as msgpack from '@msgpack/msgpack'
import { AbstractGameBook, StarNight } from '@starnight/core'
import { merge } from 'es-toolkit'
import { useReactive, useSignal } from 'micro-reactive-solid'
import { CommandMap } from '@/core/scripts'
import Sence from '@/sence'
import { resource } from '@/utils/request'

StarNight.useReactive = useReactive

// type CommandEntity = {
//     readonly key: string
//     readonly await?: true
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     readonly args: any
// }

// const raw = resource('./book.json', { responseType: 'arraybuffer' }).then(
//     (res) => msgpack.decode(new Uint8Array(res.data)) as CommandEntity[][]
// )

// export const book = raw.then(
//     (_result) =>
//         new (class extends AbstractGameBook {
//             _label = _result
//                 .map((act) => act.filter((item) => item.key === 'system-label'))
//                 .flatMap((act, index) => (act.length === 0 ? [] : [{ [act[0]['args']]: index }]))
//                 .reduce<Record<string, number>>(merge, {})

//             length: Function0<number> = () => _result.length

//             act: Function1<number, GameAct<void>> = (index) => {
//                 return async function* (context) {
//                     for (const row of _result[index]) {
//                         if (CommandMap[row.key as keyof typeof CommandMap]) {
//                             if (row.await) {
//                                 // @ts-expect-error此表达式不可调用。联合类型的每个成员都有签名，但这些签名都不能互相兼容。
//                                 await CommandMap[row.key as keyof typeof CommandMap](row.args)(context)
//                             } else {
//                                 // @ts-expect-error此表达式不可调用。联合类型的每个成员都有签名，但这些签名都不能互相兼容。
//                                 yield CommandMap[row.key as keyof typeof CommandMap](row.args)
//                             }
//                         }
//                     }
//                 }
//             }

//             label: Function1<string, number> = (sign) => this._label[sign]
//         })()
// )

export const Action = Symbol()

export let context = {} as GameRuntimeContext

export const book = Promise.resolve(
    new (class extends AbstractGameBook {
        script = Sence() as AsyncGenerator<
            Function1<GameRuntimeContext, Promise<unknown>> | typeof Action,
            void,
            GameRuntimeContext
        >

        constructor() {
            StarNight.GameEvents.setup.subscribe(() => (this.script = Sence()))
            super()
        }

        done = false

        length: Function0<number> = () => Infinity

        act: Function1<number, GameAct<void>> = () => {
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            const self = this
            return async function* (ctx) {
                context = ctx
                while (true) {
                    const { value, done } = await self.script.next()
                    if (done !== undefined) self.done = done
                    if (value === Action || done) return
                    else yield value
                }
            }
        }

        label: Function1<string, number> = () => 0
    })()
)

export const starnight = useSignal<StarNightInstance>(null as unknown as StarNightInstance)
export const ui = () => starnight().context.ui
