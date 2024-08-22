// tag:可被替换为 crypto.randomUUID() 但这是一个新特性,暂不使用
function getUuid(): string {
    let s: any = []
    let hexDigits = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    for (let i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
    }
    s[14] = '4'
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1)
    s[8] = s[13] = s[18] = s[23] = '-'
    let uuid = s.join('')
    return uuid
};

function cancleFullScreen() {
    const document = window.document as any
    document?.cancleFullScreen?.()
    document?.webkitCancelFullScreen?.()
    document?.mozCacelFullScreen?.()
    document?.msCanclFullScreen?.()
    document?.oCancelFullScreen?.()
}

function fullScreen() {
    const document = window.document as any
    document.body?.requestFullScreen?.()
    document.body?.webkitRequestFullScreen?.()
    document.body?.mozRequestFullScreen?.()
    document.body?.msRequestFullScreen?.()
    document.body?.oRequestFullScreen?.()
}

function numberListToString(list: Array<number>): string {
    if (list == undefined || list.length === 0) {
        return '[]'
    } else if (list.length === 1) {
        return JSON.stringify([
            [list[0], list[0]]
        ])
    }
    list = [...new Set(list)]
    list.sort((a, b) => (a - b))
    let collection = []
    collection.push([list[0], list[0]])
    let i = 0
    for (let x = 1; x < list.length; x++) {
        if (list[x] - list[x - 1] !== 1) {
            collection[i][1] = list[x - 1]
            i += 1
            collection.push([list[x], list[x]])
        }
    }
    collection[i][1] = list[list.length - 1]
    return JSON.stringify(collection)
}

function stringToNumberList(str: string): Array<number> {
    let list = JSON.parse(str || '[]') as Array<[number, number]>
    let res: Array<number> = []
    list.forEach(e => res.push(...to(e[0], e[1])))
    return res
}

const to = (start: number, end: number): Array<number> => {
    let i: Array<number> = []
    let go = (start: number, end: number) => {
        i.push(start)
        if (start === end) return i
        else go(start + 1, end)
    }
    go(start, end)
    return i
}

interface QuerablePromise<T> extends Promise<T> {
    isFulfilled(): boolean
    isPending(): boolean
    isRejected(): boolean
}

function makeQuerablePromise<T>(promise: Promise<T>): QuerablePromise<T> {
    // Don't modify any promise that has been already modified.
    if ((promise as unknown as Dictionary).isFulfilled) return promise as QuerablePromise<T>

    // Set initial state
    let isPending = true
    let isRejected = false
    let isFulfilled = false

    // Observe the promise, saving the fulfillment in a closure scope.
    const result = promise.then(
        (v: T) => {
            isFulfilled = true
            isPending = false
            return v
        },
        (e: any) => {
            isRejected = true
            isPending = false
            throw e
        }
    ) as QuerablePromise<T>

    result.isFulfilled = () => isFulfilled
    result.isPending = () => isPending
    result.isRejected = () => isRejected
    return result
}

function tryFn(fn: () => void) {
    try {
        fn()
    } catch (e) {
        console.error(e)
    }
}


// function eventDispatcher() {
//     const callbackList: Array<Function0<void>> = []
//     return {
//         publish() {
//             callbackList.forEach(fn => fn())
//         },
//         subscribe(callback: Function0<void>) {
//             callbackList.push(callback)
//         }
//     }
// }

export {
    getUuid,
    fullScreen,
    cancleFullScreen,
    to,
    numberListToString,
    stringToNumberList,
    makeQuerablePromise,
    tryFn
}