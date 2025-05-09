import { NonBlocking, VirtualScope } from '../../Decorator'

export const cont = NonBlocking(
    ({ output: { cont } }) =>
        () =>
            cont(true)
)

export const jump = NonBlocking<number | string>(
    ({ output: { jump, cont } }) =>
        async (target) => (jump(target), cont(true))
)

export const end = NonBlocking(
    ({ output: { end } }) =>
        () =>
            end(true)
)

export const label = VirtualScope<{ id: string }>()
