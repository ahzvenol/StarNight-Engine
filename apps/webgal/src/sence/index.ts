import type { GameSence } from './type'
import { Input, Say, System } from '@/core/scripts'
import { Action, context } from '@/store/starnight'
import { useGameScopeSignal } from './useScopeSignal'

export const color = useGameScopeSignal('#000')

export default (async function* () {
    yield Action
    while (true) {
        const input = await Input.text()(context)
        if (input === 'Exit') break
        if (CSS.supports('color', input)) {
            yield Say.apply({ text: `将设置文本颜色为:${input}` })
            await System.wait(1000)(context)
            color(input)
        } else {
            yield Say.apply({ text: `不正确的颜色参数:${input}` })
        }
        yield Action
    }
    yield Say.apply({ text: `即将退出循环` })
    yield Action
    yield Say.apply({ text: `退出循环` })
    yield System.end()
} satisfies GameSence<unknown>)
