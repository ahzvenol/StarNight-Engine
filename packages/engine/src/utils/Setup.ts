import { PromiseX } from './PromiseX'

export class Setup<T> {
    private promise = new PromiseX<T>()

    set = (value: T) => this.promise.resolve(value)

    then = this.promise.then
}
