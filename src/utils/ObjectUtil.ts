class ObjectUtils {
    static isObject(value: unknown): value is Record<any, any> {
        return Object.prototype.toString.call(value) === '[object Object]'
    }
    static isArray(value: unknown): value is Array<unknown> {
        return Object.prototype.toString.call(value) === '[object Array]'
    }
    static isString(value: unknown): value is string {
        return Object.prototype.toString.call(value) === '[object String]'
    }
    static isEmpty(object: object): boolean {
        return JSON.stringify(object) === '{}'
    }
    static isNotEmpty(object: object): boolean {
        return JSON.stringify(object) !== '{}'
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

export { ObjectUtils }
