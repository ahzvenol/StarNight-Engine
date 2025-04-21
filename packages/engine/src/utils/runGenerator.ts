import { noop } from 'es-toolkit'

export async function run<TRetrun>(
    generator: Generator<Promise<unknown>, TRetrun, void>,
    { rush, stop }: { rush: Promise<unknown>; stop: Promise<unknown> }
): Promise<TRetrun | undefined> {
    let flag: 'Normal' | 'Rush' | 'Stop' = 'Normal'

    while (true) {
        // 释放阻塞可能导致接下来的命令执行
        if (flag === 'Stop') return new Promise(noop)
        const { value, done } = generator.next()
        if (!done) {
            if (flag !== 'Rush') {
                flag = await Promise.race([
                    value.then(() => 'Normal' as const),
                    rush.then(() => 'Rush' as const),
                    stop.then(() => 'Stop' as const)
                ])
            }
        } else return value
    }
}
