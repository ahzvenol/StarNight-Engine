import { isNil } from 'es-toolkit'

export class Option<A> {
    private constructor(private readonly value: A | null) {}

    static some<A>(value: A): Option<A> {
        return new Option<A>(value)
    }

    static none<A>(): Option<A> {
        return new Option<A>(null)
    }

    static apply<A>(value: A | null): Option<A> {
        return isNil(value) ? Option.none() : Option.some(value)
    }

    isEmpty(): boolean {
        return isNil(this.value)
    }

    isDefined(): boolean {
        return !this.isEmpty()
    }

    get(): A {
        if (this.isEmpty()) {
            throw new Error('None.get')
        }
        return this.value!
    }

    getOrElse<B>(defaultValue: B): A | B {
        return this.isDefined() ? this.value! : defaultValue
    }

    orElse<B>(alternative: () => Option<B>): Option<A | B> {
        return this.isDefined() ? this : alternative()
    }

    map<B>(f: (value: A) => B): Option<B> {
        return this.isDefined() ? Option.some(f(this.value!)) : Option.none()
    }

    flatMap<B>(f: (value: A) => Option<B>): Option<B> {
        return this.isDefined() ? f(this.value!) : Option.none()
    }

    filter(predicate: (value: A) => boolean): Option<A> {
        return this.isDefined() && predicate(this.value!) ? this : Option.none()
    }

    filterNot(predicate: (value: A) => boolean): Option<A> {
        return this.filter((value) => !predicate(value))
    }

    contains(value: A): boolean {
        return this.isDefined() && this.value === value
    }

    forall(predicate: (value: A) => boolean): boolean {
        return this.isEmpty() || predicate(this.value!)
    }

    exists(predicate: (value: A) => boolean): boolean {
        return this.isDefined() && predicate(this.value!)
    }

    foreach(action: (value: A) => void): void {
        if (this.isDefined()) {
            action(this.value!)
        }
    }

    toList(): [A] | [] {
        return this.isDefined() ? [this.value!] : []
    }

    zip<B>(that: Option<B>): Option<[A, B]> {
        return this.isDefined() && that.isDefined() ? Option.some([this.value!, that.get()]) : Option.none()
    }

    unzip<B, C>(implicitPair: (value: A) => [B, C]): [Option<B>, Option<C>] {
        if (this.isEmpty()) {
            return [Option.none(), Option.none()]
        }
        const [first, second] = implicitPair(this.value!)
        return [Option.some(first), Option.some(second)]
    }
}
