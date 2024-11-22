import { NonBlocking } from '@/core/flow'

export const Continue = NonBlocking(() => () => ({ continue: true }))

export const Jump = NonBlocking(() => ({ target }: { target: number }) => ({ jump: target, continue: true }))

export const End = NonBlocking(() => () => ({ end: true }))

// const sign = (context) => ({ name }) => jumpMap[name] = index
