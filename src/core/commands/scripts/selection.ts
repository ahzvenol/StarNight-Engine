import { CommandRunFunction, State } from "@/core/Command"
import { PromiseX } from "@/utils/PromiseX"
import { Jump } from "./jump"

class Selection {
    constructor(
        description: string,
        callback: Function0<void>,
        lock: boolean = false
    ) { }
}

// 还不确定的实现,如果分为多个小sel push到数组的话无法主动阻塞，但是这样与整体设计更统一
const selection: CommandRunFunction = ({ timer, state, row, save: { individual } }) => async ({ array }) => {
    if (state === State.Init) {
        if (row in individual.jumpMap) jump() individual.jumpMap[row]
    } else {
        const selections = new Array<Selection>()
        const promises = new Array<Promise<number>>()
        for (const sel of (array as Array<Dictionary>)) {
            const promise = new PromiseX<number>()
            // context.actIndex(jumpMap[target] - 1)
            const callback = () => promise.resolve(sel.number)
            const selection = new Selection(sel.description, callback, sel.lock)
            promises.push(promise)
            selections.push(selection)
        }
        const race = Promise.race(promises)
        timer.addTrackedPromise(race)
        return race.then((num) => Jump()({ target: num }))
    }
}