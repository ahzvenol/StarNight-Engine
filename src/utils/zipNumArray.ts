function arrayToInterval(list: Array<number>): Array<[number, number]> {
    if (list == undefined || list.length === 0) {
        return []
    } else if (list.length === 1) {
        return [[list[0], list[0]]]
    }
    list = [...new Set(list)]
    list.sort((a, b) => a - b)
    const collection: Array<[number, number]> = []
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
    return collection
}

// 转换数学区间到数组
function intervalToArray(arr: Array<[number, number]>): Array<number> {
    return arr.flatMap((e) => to(e[0], e[1]))
}

const to = (start: number, end: number): Array<number> => {
    const i: Array<number> = []
    const go = (start: number, end: number) => {
        i.push(start)
        if (start === end) return i
        else go(start + 1, end)
    }
    go(start, end)
    return i
}

export { arrayToInterval, intervalToArray }
