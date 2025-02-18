import { noop } from 'es-toolkit'

export async function run<TRetrun>(
    generator: Generator<Promise<unknown>, TRetrun, void>,
    { immediate, cancel }: { immediate: Promise<void>; cancel: Promise<void> }
): Promise<TRetrun | undefined> {
    let flag: 'Normal' | 'Fast' | 'Cancel' = 'Normal'
    // eslint-disable-next-line no-constant-condition
    while (true) {
        // 游戏销毁与新游戏实例创建几乎同时发生,阻塞状态的生成器直接返回可能导致后面的命令泄漏到新实例,实际我们希望它继续阻塞
        if (flag === 'Cancel') return new Promise(noop)
        const { value, done } = generator.next()
        if (!done) {
            if (flag !== 'Fast') {
                flag = await Promise.race([
                    value.then(() => 'Normal' as const),
                    immediate.then(() => 'Fast' as const),
                    cancel.then(() => 'Cancel' as const)
                ])
            }
        } else return value
    }
}
