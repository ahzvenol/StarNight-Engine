// declare const less: any

// type Dictionary<T = any> = Record<string | number, T>

type Function0<R> = () => R
type Function1<T1, R> = (arg0: T1) => R
type Function2<T1, T2, R> = (arg0: T1, arg1: T2) => R
type Function3<T1, T2, T3, R> = (arg0: T1, arg1: T2, arg2: T3) => R

interface HTMLAudioElement {
    cloneNode(): HTMLAudioElement
}

interface NumberConstructor {
    isFinite(number: unknown): number is number
}

interface HTMLImageElement {
    meta: string
}

interface HTMLAudioElement {
    meta: string
}
