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

function assiginObject(target = {}, source = {}): any {
    let obj = target
    if (typeof target != 'object' || typeof source != 'object') {
        throw new Error("参数中存在非Object类型")
    }
    for (let key in source) {
        // 如果target也存在 那就再次合并
        if (target.hasOwnProperty(key)) {
            obj[key] = assiginObject(target[key], source[key])
        } else {
            // 不存在就直接添加
            obj[key] = source[key]
        }
    }
    return obj
}

class ObjectUtils {
    static isObject(value: unknown): value is Record<any, any> {
        return Object.prototype.toString.call(value) === "[object Object]"
    }
    static isArray(value: unknown): value is Array<unknown> {
        return Object.prototype.toString.call(value) === '[object Array]'
    }
    static isString(value: unknown): value is string {
        return Object.prototype.toString.call(value) === '[object String]'
    }
    static isEmpty(object: Object): boolean {
        return JSON.stringify(object) === "{}"
    }
    static isNotEmpty(object: Object): boolean {
        return JSON.stringify(object) !== "{}"
    }
    static forEach<K extends string | number | symbol, V>(object: Partial<Record<K, V>>) {
        return function (callback: (entry: [K, V]) => void) {
            for (const key in object) {
                callback([key, object[key]!])
            }
        }
    }
    static map<K extends string | number | symbol, V>(object: Partial<Record<K, V>>) {
        return function <U>(callback: (entry: [K, V]) => [K, U]) {
            const result = {} as Partial<Record<K, U>>
            for (const key in object) {
                const [k, v] = callback([key, object[key]!])
                result[k] = v
            }
            return result
        }
    }
    static fitter<K extends string | number | symbol, V>(object: Partial<Record<K, V>>) {
        return function (callback: (entry: [K, V]) => boolean) {
            const result = {} as Partial<Record<K, V>>
            for (const key in object) {
                if (callback([key, object[key]!])) {
                    result[key] = object[key]
                }
            }
            return result
        }
    }
}

class ArrayUtils {
    static shallowClone<T>(array: Array<T>, count: number = 1): Array<T> {
        let array1: Array<T> = []
        for (let i = 0; i < count; i++) {
            array1 = array1.concat(array)
        }
        return array1
    }
    static deepClone<T>(array: Array<T>, count?: number): Array<T> {
        return count
            ? JSON.parse(JSON.stringify(this.shallowClone(array, count)))
            : JSON.parse(JSON.stringify(array))
    }
}

type Level = "DEBUG" | "INFO" | "WARN" | "ERROR"
class Logger {
    static dic = { DEBUG: '#7799BB', INFO: '#009966', WARN: '#DD5544', ERROR: '#CC2233' }
    static clog(level: Level, info: any) {
        console.log(
            `%c[${level}]%c [${new Date().format("yyyy/MM/dd hh:mm:ss")}] %c${info}`,
            `color:white;background-color:${Logger.dic[level]}`,
            `color:${Logger.dic[level]}`,
            ''
        )
    }
    debug(info: any) {
        const level = 'DEBUG'
        Logger.clog(level, info)
    }
    info(info: any) {
        const level = 'INFO'
        Logger.clog(level, info)
    }
    warn(info: any) {
        const level = 'WARN'
        Logger.clog(level, info)
    }
    error(info: any) {
        const level = 'ERROR'
        Logger.clog(level, info)
    }
}

// 不全改成静态函数是因为代码提示问题
const logger = new Logger()

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
        if (start === end) return i //return不出去,迷惑极了
        else go(start + 1, end)
    }
    go(start, end)
    return i
}

export {
    getUuid,
    assiginObject,
    ObjectUtils,
    ArrayUtils,
    logger,
    fullScreen,
    cancleFullScreen,
    to,
    numberListToString,
    stringToNumberList,
}