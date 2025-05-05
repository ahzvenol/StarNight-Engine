import type { StarNightInstance } from '@starnight/core'
import * as msgpack from '@msgpack/msgpack'
import { StarNight } from '@starnight/core'
import { useReactive, useSignal } from 'micro-reactive-solid'
import { commands } from '@/core/script'
import { resource } from '@/utils/request'

Object.assign(StarNight.Commands, commands)

StarNight.useReactive = useReactive

const raw = resource('./book.json', { responseType: 'arraybuffer' }).then(
    (res) => msgpack.decode(new Uint8Array(res.data)) as GameBookRaw
)

export const book = raw.then((raw) => GameBook.create(raw, new Converter(StarNight.Commands, StarNight.Marcos)))

export const starnight = useSignal<StarNightInstance>(null as unknown as StarNightInstance)
export const ui = () => starnight().context.ui
