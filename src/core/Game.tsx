import { useReactive } from 'micro-reactive'
import { type Component, createEffect, onCleanup, onMount, on } from 'solid-js'

import { newCommands } from './commands/index.js'
import { State, newLifecycle, newUtil } from './state.js'
import { preLoad } from '../store/preload.js'
import { logger } from '../util/index.js'

declare const Book: Array<Array<ObjectMap>>

const Game: Component<{ propRowIndex: number }> = ({ propRowIndex }) => {
    const state = new State()
    const lifecycle = newLifecycle(state)
    const commands = newCommands()
    const util = newUtil(state)

    const clickLock = useReactive(false)
    const rowIndex = useReactive(0)

    createEffect(on(rowIndex, () => {
        if (state.now !== 'I') preLoad(rowIndex() + 5)
    }, { defer: true }))

    onMount(async () => {
        window.userData.backgroundAudio.src = ''
        clickLock(true)
        for (let x = 0; x < propRowIndex; x++) {
            if (x === propRowIndex - 1) state.now = 'R'
            logger.info(`正在初始化...第${x + 1}轮循环`)
            // await解决回调执行顺序错乱
            await click()
        }
        clickLock(false)
        // tag:过渡兼容方案
        for (let i = 0; i <= 5; i++) {
            preLoad(rowIndex() + i)
        }
    })
    onCleanup(() => {

    })

    async function click() {
        util.onActStart(() => {
            lifecycle.notInit(() => {
                logger.info(`开始执行第${rowIndex()}幕...`)
                util.onActEnd(() => {
                    logger.info('执行结束')
                })
            })

        })
        if (state.actRunning()) {
            logger.info('二次点击,立即执行全部回调')
            state.bridge.immedExec()
        } else {
            rowIndex(rowIndex() + 1)
            state.actStart()
            // 考虑在主界面就获取并处理剧本?
            // for (let i of book[rowIndex()]) {
            //     await commands[i['@']]['R'](i)
            // }
            // state.actEnd()

            // 实现了命令内部的幕级中断,只需要返回一个Promise.reject()即可
            book[rowIndex()]
                .map(i => async () => commands[i['@']]?.['R'](i))
                .reduce<Promise<void>>((p, e) => p.then(() => e()), Promise.resolve())
                .catch().then(state.actEnd)
        }
    }

    // todo:文本框允许css,并使用宏实现默认文本框
    // todo:空格等省力的点击方式
    return <canvas id="canvas" width="1280" height="720" onclick={() => clickLock() ? '' : click()} />
}

export default Game