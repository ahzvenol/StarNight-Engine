/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Try } from './Try'
import { Option } from './Option'
import { Failure, Success } from './Try'

export abstract class Either<A, B> {
    abstract isLeft(): boolean
    abstract isRight(): boolean

    abstract fold<C>(fa: (left: A) => C, fb: (right: B) => C): C
    abstract get(): B
    abstract getOrElse<B1>(defaultValue: B1): B | B1
    abstract orElse<A1, B1>(alternative: () => Either<A1, B1>): Either<A | A1, B | B1>
    abstract map<B1>(f: (right: B) => B1): Either<A, B1>
    abstract flatMap<A1, B1>(f: (right: B) => Either<A1, B1>): Either<A | A1, B1>
    abstract swap(): Either<B, A>
    abstract toList(): Array<B>
    abstract toOption(): Option<B>
    abstract toTry(): Try<B>

    static left<A, B>(value: A): Either<A, B> {
        return new Left<A, B>(value)
    }

    static right<A, B>(value: B): Either<A, B> {
        return new Right<A, B>(value)
    }
}

export class Left<A, B> extends Either<A, B> {
    constructor(public readonly value: A) {
        super()
    }

    isLeft(): boolean {
        return true
    }

    isRight(): boolean {
        return false
    }

    fold<C>(fa: (left: A) => C, _fb: (right: B) => C): C {
        return fa(this.value)
    }

    get(): B {
        throw new Error('Either.left.get on Right')
    }

    getOrElse<B1>(defaultValue: B1): B1 {
        return defaultValue
    }

    orElse<A1, B1>(alternative: () => Either<A1, B1>): Either<A1, B1> {
        return alternative()
    }

    map<B1>(_f: (right: B) => B1): Either<A, B1> {
        return this as unknown as Either<A, B1>
    }

    flatMap<A1, B1>(_f: (right: B) => Either<A1, B1>): Either<A, B1> {
        return this as unknown as Either<A, B1>
    }

    swap(): Either<B, A> {
        return new Right<B, A>(this.value)
    }

    toList(): Array<B> {
        return []
    }

    toOption(): Option<B> {
        return Option.none()
    }

    toTry(): Try<B> {
        return new Failure(this.value)
    }
}

export class Right<A, B> extends Either<A, B> {
    constructor(public readonly value: B) {
        super()
    }

    isLeft(): boolean {
        return false
    }

    isRight(): boolean {
        return true
    }

    fold<C>(_fa: (left: A) => C, fb: (right: B) => C): C {
        return fb(this.value)
    }

    get(): B {
        return this.value
    }

    getOrElse<B1>(_defaultValue: B1): B {
        return this.value
    }

    orElse<A1, B1>(_alternative: () => Either<A1, B1>): Either<A, B> {
        return this
    }

    map<B1>(f: (right: B) => B1): Either<A, B1> {
        return new Right<A, B1>(f(this.value))
    }

    flatMap<A1, B1>(f: (right: B) => Either<A1, B1>): Either<A | A1, B1> {
        return f(this.value)
    }

    swap(): Either<B, A> {
        return new Left(this.value)
    }

    toList(): Array<B> {
        return [this.value]
    }

    toOption(): Option<B> {
        return Option.some(this.value)
    }

    toTry(): Try<B> {
        return new Success(this.value)
    }
}
