import { Args, CommandRunFunction, State } from '@/core/Command'
import { PromiseX } from '@/utils/PromiseX'
import { Jump } from './!'
import { useSignal } from '@/utils/Reactive'

interface Selection {
    description: string
    callback: () => void
    lock: boolean
}

const selections = useSignal<Array<Selection>>([])

const beforeInit = () => selections([])

// 还不确定的实现,如果分为多个小sel push到数组的话无法主动阻塞，但是这样与整体设计更统一
const selection: CommandRunFunction =
    ({ timer, variables }) =>
    ({ array }) => {
        const promises = new Array<Promise<number>>()
        for (const data of array as Array<Args>) {
            const promise = new PromiseX<number>()
            const callback = () => promise.resolve(data.number)
            const selection: Selection = {
                description: data.text,
                callback: callback,
                lock: data.bool
            }
            promises.push(promise)
            selections().push(selection)
        }
        return Promise.race(promises)
            .then(() => selection([]))
            .then((num) => Jump.apply()({ target: num }))
    }
