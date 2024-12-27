import { NonBlocking } from '@/core/flow'
import { _continue, _end, _jump } from './abstract/flow'

export const Continue = NonBlocking(() => () => _continue())

export const Jump = NonBlocking(
    () =>
        ({ target }: { target: number }) =>
            _jump(target)
)

export const End = NonBlocking(() => () => _end())

// const sign = (context) => ({ name }) => jumpMap[name] = index