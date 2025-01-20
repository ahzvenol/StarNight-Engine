import { noop } from 'es-toolkit'
import { Y } from '@/utils/fp'

export async function runGeneratorAsyncWithControl<TRetrun>(
    generator: Generator<Promise<void>, TRetrun, void>,
    { immediate, cancel }: { immediate: Promise<void>; cancel: Promise<void> }
): Promise<TRetrun | undefined> {
    return Y<'Normal' | 'Fast' | 'Cancel', Promise<TRetrun | undefined>>((rec) => async (flag) => {
        // 游戏销毁与新游戏实例创建几乎同时发生,阻塞状态的生成器直接返回可能导致后面的命令泄漏到新实例,实际我们希望它继续阻塞
        if (flag === 'Cancel') return new Promise(noop)
        const { value, done } = generator.next()
        if (!done) {
            if (flag === 'Fast') return rec('Fast')
            else
                return rec(
                    await Promise.race([
                        value.then(() => 'Normal' as const),
                        immediate.then(() => 'Fast' as const),
                        cancel.then(() => 'Cancel' as const)
                    ])
                )
        } else return value
    })('Normal')
}

export function runGeneratorSync<TRetrun>(generator: Generator<Promise<void>, TRetrun, void>): TRetrun {
    return Y<void, TRetrun>((rec) => () => {
        const { value, done } = generator.next()
        if (!done) return rec()
        else return value
    })()
}
