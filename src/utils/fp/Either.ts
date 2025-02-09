/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Try } from './Try'
import { Option } from './Option'
import { Failure, Success } from './Try'

export abstract class Either<A, B> {
    abstract isLeft(): this is Left<A, B>
    abstract isRight(): this is Right<A, B>

    abstract fold<C>(fa: (left: A) => C, fb: (right: B) => C): C
    abstract get(): B
    abstract getOrElse<B1>(defaultValue: B1): B | B1
    abstract orElse<A1, B1>(alternative: () => Either<A1, B1>): Either<A | A1, B | B1>
    abstract map<B1>(f: (right: B) => B1): Either<A, B1>
    abstract flatMap<A1, B1>(f: (right: B) => Either<A1, B1>): Either<A | A1, B1>
    abstract swap(): Either<B, A>
    abstract toList(): [B] | []
    abstract toOption(): Option<B>
    abstract toTry(): Try<B>

    get left(): LeftProjection<A, B> {
        return new LeftProjection(this)
    }

    get right(): RightProjection<A, B> {
        return new RightProjection(this)
    }

    static left<A, B = any>(value: A): Either<A, B> {
        return new Left<A, B>(value)
    }

    static right<B, A = any>(value: B): Either<A, B> {
        return new Right<A, B>(value)
    }
}

export class Left<A, B> extends Either<A, B> {
    constructor(public readonly value: A) {
        super()
    }

    isLeft(): this is Left<A, B> {
        return true
    }

    isRight(): this is Right<A, B> {
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

    toList(): [] {
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

    isLeft(): this is Left<A, B> {
        return false
    }

    isRight(): this is Right<A, B> {
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

    toList(): [B] {
        return [this.value]
    }

    toOption(): Option<B> {
        return Option.some(this.value)
    }

    toTry(): Try<B> {
        return new Success(this.value)
    }
}

export class LeftProjection<A, B> {
    constructor(private readonly either: Either<A, B>) {}

    get(): A {
        if (this.either.isLeft()) {
            return (this.either as Left<A, B>).value
        }
        throw new Error('Either.left.get on Right')
    }

    foreach(f: (value: A) => void): void {
        if (this.either.isLeft()) {
            f((this.either as Left<A, B>).value)
        }
    }

    getOrElse<A1>(defaultValue: A1): A | A1 {
        return this.either.isLeft() ? (this.either as Left<A, B>).value : defaultValue
    }

    forall(predicate: (value: A) => boolean): boolean {
        return this.either.isLeft() ? predicate((this.either as Left<A, B>).value) : true
    }

    exists(predicate: (value: A) => boolean): boolean {
        return this.either.isLeft() ? predicate((this.either as Left<A, B>).value) : false
    }

    map<A1>(f: (value: A) => A1): Either<A1, B> {
        return this.either.isLeft()
            ? Either.left(f((this.either as Left<A, B>).value))
            : (this.either as unknown as Right<A1, B>)
    }

    flatMap<A1, B1>(f: (value: A) => Either<A1, B1>): Either<A1, B | B1> {
        return this.either.isLeft()
            ? f((this.either as Left<A, B>).value)
            : (this.either as unknown as Right<A1, B | B1>)
    }

    toOption(): Option<A> {
        return this.either.isLeft() ? Option.some((this.either as Left<A, B>).value) : Option.none()
    }

    toList(): [A] | [] {
        return this.either.isLeft() ? [(this.either as Left<A, B>).value] : []
    }
}

export class RightProjection<A, B> {
    constructor(private readonly either: Either<A, B>) {}

    get(): B {
        if (this.either.isRight()) {
            return (this.either as Right<A, B>).value
        }
        throw new Error('Either.right.get on Left')
    }

    foreach(f: (value: B) => void): void {
        if (this.either.isRight()) {
            f((this.either as Right<A, B>).value)
        }
    }

    getOrElse<B1>(defaultValue: B1): B | B1 {
        return this.either.isRight() ? (this.either as Right<A, B>).value : defaultValue
    }

    forall(predicate: (value: B) => boolean): boolean {
        return this.either.isRight() ? predicate((this.either as Right<A, B>).value) : true
    }

    exists(predicate: (value: B) => boolean): boolean {
        return this.either.isRight() ? predicate((this.either as Right<A, B>).value) : false
    }

    map<B1>(f: (value: B) => B1): Either<A, B1> {
        return this.either.isRight()
            ? Either.right(f((this.either as Right<A, B>).value))
            : (this.either as unknown as Left<A, B1>)
    }

    flatMap<A1, B1>(f: (value: B) => Either<A1, B1>): Either<A | A1, B1> {
        return this.either.isRight()
            ? f((this.either as Right<A, B>).value)
            : (this.either as unknown as Left<A | A1, B1>)
    }

    toOption(): Option<B> {
        return this.either.isRight() ? Option.some((this.either as Right<A, B>).value) : Option.none()
    }

    toList(): [B] | [] {
        return this.either.isRight() ? [(this.either as Right<A, B>).value] : []
    }
}
