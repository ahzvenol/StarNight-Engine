import { CommandRunFunction } from '@/core/Command'
import { useSignal } from '@/utils/Reactive'
import { Y } from '@/utils/FPUtil'

// 跨幕环境变量name,无副作用
// 存在依赖变量的"文字播放速度"

// 从暂停角度讲这部分还是属于Core
// 与audio命令以及未知音轨参数target存在疑问
// 大概是通过宏混合,另外也是同时独立这个配置出去以免成为系统变量
// name参数是可选的

export const textView = useSignal('')

const text: CommandRunFunction<{ text: string }> =
    ({ store, timer }) =>
    ({ text }) => {
        console.log(text)
        return Y<string, Promise<void>>((rec) => (str) => {
            return Promise.resolve()
                .then(() => textView((text) => text + str.substring(0, 1)))
                .then(() => timer.delay(store.config.TextSpeed * 100))
                .then(() => {
                    if (str.length >= 1) return rec(str.substring(1))
                })
        })(text)
    }

export const Text = { beforeInit: () => textView(''), onActStart: () => textView(''), run: text }

export const nameView = useSignal('')

const name: CommandRunFunction<{ name: string }> =
    () =>
    ({ name }) => {
        nameView(name)
    }

export const Name = { beforeInit: () => nameView(''), run: name }
