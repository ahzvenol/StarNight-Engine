import type { AbstractGameBook, GameAct } from '@starnight/core'
import * as msgpack from '@msgpack/msgpack'
import { merge } from 'es-toolkit'
import { FlattenCommands } from '@/core/scripts'
import { resource } from '@/utils/request'

type CommandEntity = {
    readonly key: string
    readonly await?: true
    readonly args: unknown
}

const raw = resource('./book.json', { responseType: 'arraybuffer' }).then(
    (res) => msgpack.decode(new Uint8Array(res.data)) as CommandEntity[][]
)

export const book = () =>
    raw.then(
        (_result) =>
            new (class JsonBook implements AbstractGameBook {
                _label = _result
                    .map((act) => act.filter((item) => item.key === 'system-label'))
                    .flatMap((act, index) => (act.length === 0 ? [] : [{ [act[0]['args'] as string]: index }]))
                    .reduce<Record<string, number>>(merge, {})

                length: Function0<number> = () => _result.length

                act: Function1<number, GameAct<void>> = (index) => {
                    return async function* (context) {
                        for (const row of _result[index]) {
                            if (FlattenCommands[row.key as keyof typeof FlattenCommands]) {
                                if (row.await) {
                                    // @ts-expect-error 此表达式不可调用。联合类型的每个成员都有签名，但这些签名都不能互相兼容。
                                    await CommandMap[row.key as keyof typeof CommandMap](row.args)(context)
                                } else {
                                    // @ts-expect-error 此表达式不可调用。联合类型的每个成员都有签名，但这些签名都不能互相兼容。
                                    yield CommandMap[row.key as keyof typeof CommandMap](row.args)
                                }
                            }
                        }
                    }
                }

                label: Function1<string, number> = (sign) => this._label[sign]
            })()
    )
