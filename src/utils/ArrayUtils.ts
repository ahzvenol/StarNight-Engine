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
    static sameElements<T>(array1: Array<T>, array2: Array<T>) {
        if (array1.length !== array2.length) return false
        for (let i = 0; i < array1.length; i++) {
            if (array1[i] !== array2[i]) {
                return false
            }
        }
        return true
    }
}

export { ArrayUtils }