import { NonBlocking } from '../Decorator'

export const cont = NonBlocking(
    ({ output: { cont } }) =>
        () =>
            cont(true)
)

export const end = NonBlocking(
    ({ output: { end } }) =>
        () =>
            end(true)
)
