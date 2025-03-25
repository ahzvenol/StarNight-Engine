export const Y: <A, B = A>(func: Function1<Function1<A, B>, Function1<A, B>>) => Function1<A, B> = (func) => (value) =>
    func(Y(func))(value)

export const compose: <A, B, C>(f: Function1<B, C>, g: Function1<A, B>) => Function1<A, C> = (f, g) => (a) => f(g(a))
