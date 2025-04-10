import { noop } from 'es-toolkit'

export async function run<TRetrun>(
    generator: Generator<Promise<unknown>, TRetrun, void>,
    { rush, destroy }: { rush: Promise<void>; destroy: Promise<void> }
): Promise<TRetrun | undefined> {
    let flag: 'Normal' | 'Fast' | 'Destroy' = 'Normal'
    // eslint-disable-next-line no-constant-condition
    while (true) {
        // 释放阻塞可能导致接下来的命令泄漏到新游戏实例
        if (flag === 'Destroy') return new Promise(noop)
        const { value, done } = generator.next()
        if (!done) {
            if (flag !== 'Fast') {
                flag = await Promise.race([
                    value.then(() => 'Normal' as const),
                    rush.then(() => 'Fast' as const),
                    destroy.then(() => 'Destroy' as const)
                ])
            }
        } else return value
    }
}
