import { CommandRunFunction } from '@/core/Command'
import { PromiseX } from '@/utils/PromiseX'
import { Jump } from './!'
import { useSignal } from '@/utils/Reactive'

interface Selection {
    label: string
    disable: boolean
    select: () => void
}

const selections = useSignal<Array<Selection>>([])

const promises = new Array<Promise<number>>()

const beforeInit = () => selections([])

// 还不确定的实现,如果分为多个小sel push到数组的话无法主动阻塞，但是这样与整体设计更统一
const selection: CommandRunFunction<{ name: string; target: number; disable?: boolean }> =
    () =>
    ({ name, target, disable = false }) => {
        const promise = new PromiseX<number>()
        selections().push({
            label: name,
            disable: disable,
            select: () => promise.resolve(target)
        })
        promises.push(promise)
    }

const build = () => () =>
    Promise.race(promises)
        .then((num) => Jump()({ target: num }))
        .then(() => selections([]))
