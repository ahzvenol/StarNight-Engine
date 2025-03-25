import { range } from 'es-toolkit'

function arrayToRanges(list: Array<number>): Array<[number, number]> {
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

export class RangeSet {
    private constructor(private ranges: Array<[number, number]> = []) {}
    static fromRanges = (arr: Array<[number, number]>) => new RangeSet(arr)
    static fromArray = (arr: Array<number>) => new RangeSet(arrayToRanges(arr))
    push = (num: number) => {
        if (!this.includes(num)) {
            this.ranges = arrayToRanges([...this.getArray(), num])
        }
        return this
    }
    includes = (num: number): boolean => this.ranges.some((e) => e[0] <= num && num <= e[1])
    getRanges = (): Array<[number, number]> => this.ranges
    getArray = (): Array<number> => this.ranges.flatMap((e) => range(e[0], e[1] + 1))
}
