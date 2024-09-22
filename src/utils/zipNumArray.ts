const to = (start: number, end: number): Array<number> => {
    const arr: Array<number> = []
    const go = (start: number, end: number) => {
        arr.push(start)
        if (start === end) return arr
        else go(start + 1, end)
    }
    go(start, end)
    return arr
}

// 转换数组到数学区间以压缩空间占用
function arrayToInterval(list: Array<number>): string {
    if (list == undefined || list.length === 0) {
        return '[]'
    } else if (list.length === 1) {
        return JSON.stringify([[list[0], list[0]]])
    }
    list = [...new Set(list)]
    list.sort((a, b) => a - b)
    const collection = []
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

// 转换数学区间到数组
function intervalToArray(str: string): Array<number> {
    const list = JSON.parse(str || '[]') as Array<[number, number]>
    const res: Array<number> = []
    list.forEach((e) => res.push(...to(e[0], e[1])))
    return res
}

export { arrayToInterval, intervalToArray }
