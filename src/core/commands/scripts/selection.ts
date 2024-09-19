import { Args, CommandRunFunction, State } from "@/core/Command"
import { PromiseX } from "@/utils/PromiseX"
import { Jump } from "./!jump"

class Selection {
    constructor(
        description: string,
        callback: Function0<void>,
        lock: boolean = false
    ) { }
}

// 还不确定的实现,如果分为多个小sel push到数组的话无法主动阻塞，但是这样与整体设计更统一
const selection: CommandRunFunction =
    ({ timer, state, row, variables: { selection }, save: { individual: { jumpMap } } }) => ({ array }) => {
        if (state === State.Init) {
            if (row in jumpMap) {
                // @ts-expect-error
                Jump.run({ state })({ number: jumpMap[row] })
            }
        } else {
            const selections = new Array<Selection>()
            const promises = new Array<Promise<number>>()
            for (const sel of (array as Array<Args>)) {
                const promise = new PromiseX<number>()
                const callback = () => promise.resolve(sel.number)
                const selection = new Selection(sel.text, callback, sel.bool)
                promises.push(promise)
                selections.push(selection)
            }
            selection(selections)
            const race = Promise.race(promises)
                // @ts-expect-error
                .then((num) => Jump.run({ state })({ number: num }))
                .then(() => selection(undefined))
            timer.addTrackedPromise(race)
            return race
        }
    }