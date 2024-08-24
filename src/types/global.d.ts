// declare const less: any

declare module '*.json'

type Dictionary<T = any> = Record<string | number , T>

type Function0<R> = () => R
type Function1<T1, R> = (arg0: T1) => R
type Function2<T1, T2, R> = (arg0: T1, arg1: T2) => R

interface HTMLAudioElement{
    cloneNode(): HTMLAudioElement
}