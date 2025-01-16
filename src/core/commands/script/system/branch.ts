import { isString } from 'es-toolkit'
import { Blocking, NonBlocking } from '@/core/command'
import book from '@/store/book'
import { log } from '@/utils/logger'

export const Continue = NonBlocking(() => () => ({ continue: true }))

export const Jump = Blocking<{ target: number | string }>(
    () =>
        async ({ target }) =>
            isString(target)
                ? book
                      .sign(target)
                      .then((target) => ({ jump: target, continue: true }))
                      .catch(() => log.error(`没有找到跳转目标:${target}`))
                : { jump: target, continue: true }
)

export const End = NonBlocking(() => () => ({ end: true }))

// 预编译命令,实际上什么也不做
export const sign = NonBlocking<{ name: string }>(() => () => {})
