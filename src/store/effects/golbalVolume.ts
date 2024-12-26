import { Howler } from 'howler'
import { createEffect } from 'solid-js'
import { storePromise } from '../store'

export const effect = () => storePromise.then((store) => createEffect(() => Howler.volume(store.config.golbalvolume())))
