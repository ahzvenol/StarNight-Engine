export const Y: <T, R = T>(func: Function1<Function1<T, R>, Function1<T, R>>) => Function1<T, R> = (func) => (value) =>
    func(Y(func))(value)
