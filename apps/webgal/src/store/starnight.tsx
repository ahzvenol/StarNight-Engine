import type { GameAct, StarNightInstance } from '@starnight/core'
import * as msgpack from '@msgpack/msgpack'
import { AbstractGameBook, StarNight } from '@starnight/core'
import { merge } from 'es-toolkit'
import { useReactive, useSignal } from 'micro-reactive-solid'
import { CommandMap } from '@/core/scripts'
import { resource } from '@/utils/request'

StarNight.useReactive = useReactive

type CommandEntity = {
    readonly key: string
    readonly await?: true
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    readonly args: any
}

const raw = resource('./book.json', { responseType: 'arraybuffer' }).then(
    (res) => msgpack.decode(new Uint8Array(res.data)) as CommandEntity[][]
)

export const book = raw.then(
    (_result) =>
        new (class extends AbstractGameBook {
            _label = _result
                .map((act) => act.filter((item) => item.key === 'system-label'))
                .flatMap((act, index) => (act.length === 0 ? [] : [{ [act[0]['args']]: index }]))
                .reduce<Record<string, number>>(merge, {})

            length: Function0<number> = () => _result.length

            act: Function1<number, GameAct> = (index) => {
                console.log(this._label)
                return async function* (context) {
                    for (const row of _result[index]) {
                        if (CommandMap[row.key as keyof typeof CommandMap]) {
                            if (row.await) {
                                // @ts-expect-error此表达式不可调用。联合类型的每个成员都有签名，但这些签名都不能互相兼容。
                                await CommandMap[row.key as keyof typeof CommandMap](row.args)(context)
                            } else {
                                // @ts-expect-error此表达式不可调用。联合类型的每个成员都有签名，但这些签名都不能互相兼容。
                                yield CommandMap[row.key as keyof typeof CommandMap](row.args)
                            }
                        }
                    }
                }
            }

            label: Function1<string, number> = (sign) => this._label[sign]
        })()
)

export const starnight = useSignal<StarNightInstance>(null as unknown as StarNightInstance)
export const ui = () => starnight().context.ui
