import { noInit } from '@/core/macro'
import { CommandRunFunction } from '@/core/type'
import { STAR_MARKER } from '@/ui/Hoshizora/Game/TextBox'
import { Y } from '@/utils/FPUtil'
import { useSignal } from '@/utils/Reactive'

// 跨幕环境变量name,无副作用
// 存在依赖变量的"文字播放速度"

export const textView = useSignal('')

const text: CommandRunFunction<{ text: string }> =
    ({ store, timer }) =>
    ({ text }) =>
        Y<string, Promise<void>>((rec) => (str) => {
            return Promise.resolve()
                .then(() => textView((text) => text + str.substring(0, 1)))
                .then(() => timer.delay(store.config.TextSpeed * 100))
                .then(() => {
                    if (str.length >= 1) return rec(str.substring(1))
                    else textView((text) => text + STAR_MARKER)
                })
        })(text)

export const Text = noInit(text)

export const TextHooks = { beforeInit: () => textView(''), beforeActStart: () => textView('') }

export const nameView = useSignal('')

const name: CommandRunFunction<{ name: string }> =
    () =>
    ({ name }) => {
        nameView(name)
    }

export const Name = noInit(name)

export const NameHooks = { beforeInit: () => nameView('') }
