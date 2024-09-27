import { Args, CommandRunFunction, State } from '@/core/Command'
import { PromiseX } from '@/utils/PromiseX'
import { Jump } from './!'

interface Selection {
    description: string
    callback: () => void
    lock: boolean
}

// 还不确定的实现,如果分为多个小sel push到数组的话无法主动阻塞，但是这样与整体设计更统一
const selection: CommandRunFunction =
    ({ timer, variables }) =>
    ({ array }) => {
        const selections = new Array<Selection>()
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
            selections.push(selection)
        }
        variables.reactive.selection(selections)
        const race = Promise.race(promises).then((num) => Jump.run()({ target: num }))
        race.then(() => variables.reactive.selection(null))
        timer.addTrackedPromise(race)
        return race
    }
