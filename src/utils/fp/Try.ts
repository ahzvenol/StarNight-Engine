/* eslint-disable @typescript-eslint/no-unused-vars */
import { Either } from './Either'
import { Option } from './Option'

export abstract class Try<T> {
    abstract isSuccess(): this is Success<T>
    abstract isFailure(): this is Failure<T>
    abstract get(): T
    abstract getOrElse<U>(defaultValue: U): T | U
    abstract orElse<U>(defaultTry: Try<U>): Try<T | U>
    abstract map<U>(fn: (value: T) => U): Try<U>
    abstract flatMap<U>(fn: (value: T) => Try<U>): Try<U>
    abstract recover<U>(fn: (error: unknown) => U): Try<T | U>
    abstract recoverWith<U>(fn: (error: unknown) => Try<U>): Try<T | U>
    abstract toOption(): Option<T>
    abstract toEither(): Either<unknown, T>

    static apply<T>(fn: () => T): Try<T> {
        try {
            return new Success(fn())
        } catch (error) {
            return new Failure(error)
        }
    }

    static success<T>(value: T): Try<T> {
        return new Success(value)
    }

    static failure<T>(value: unknown): Try<T> {
        return new Failure(value)
    }
}

export class Success<T> extends Try<T> {
    constructor(private readonly value: T) {
        super()
    }

    isSuccess(): this is Success<T> {
        return true
    }

    isFailure(): this is Failure<T> {
        return false
    }

    get(): T {
        return this.value
    }

    getOrElse<U>(_defaultValue: U): T {
        return this.value
    }

    orElse<U>(_defaultTry: Try<U>): Try<T> {
        return this
    }

    map<U>(fn: (value: T) => U): Try<U> {
        return Try.apply(() => fn(this.value))
    }

    flatMap<U>(fn: (value: T) => Try<U>): Try<U> {
        return fn(this.value)
    }

    recover<U>(_fn: (error: unknown) => U): Try<T> {
        return this
    }

    recoverWith<U>(_fn: (error: unknown) => Try<U>): Try<T> {
        return this
    }

    toOption(): Option<T> {
        return Option.some(this.value)
    }

    toEither(): Either<unknown, T> {
        return Either.right(this.value)
    }
}

export class Failure<T> extends Try<T> {
    constructor(private readonly error: unknown) {
        super()
    }

    isSuccess(): this is Success<T> {
        return false
    }

    isFailure(): this is Failure<T> {
        return true
    }

    get(): T {
        throw this.error
    }

    getOrElse<U>(defaultValue: U): U {
        return defaultValue
    }

    orElse<U>(defaultTry: Try<U>): Try<U> {
        return defaultTry
    }

    map<U>(_fn: (value: T) => U): Try<U> {
        return new Failure<U>(this.error)
    }

    flatMap<U>(_fn: (value: T) => Try<U>): Try<U> {
        return new Failure<U>(this.error)
    }

    recover<U>(fn: (error: unknown) => U): Try<T | U> {
        return Try.apply(() => fn(this.error))
    }

    recoverWith<U>(fn: (error: unknown) => Try<U>): Try<T | U> {
        try {
            return fn(this.error)
        } catch (error) {
            return new Failure(error)
        }
    }

    toOption(): Option<T> {
        return Option.none()
    }

    toEither(): Either<unknown, T> {
        return Either.left(this.error)
    }
}
