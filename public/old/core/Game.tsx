import { useReactive } from 'micro-reactive'
import { createEffect, onCleanup, onMount, on } from 'solid-js'
import { preLoad } from '../store/preload.js'
import init from './gameInit'
import book from '../assets/book.json'

export default (props: { propRowIndex: number }) => {
    // fix 初始化内容都需要放在onMount钩子里,这带来了作用域问题
    // 依照测试结果看,如果不缓存组件,每次组件运行data都会刷新,直接写在函数体中的变量也不能达到常量的效果
    const { commands, state, util } = init()
    const clickLock = useReactive(false)
    const rowIndex = useReactive(0)
    onMount(async () => {
        // fix 需要查询组件初始化时禁止运行的解决方案
        createEffect(on(rowIndex, () => {
            if (state.now !== 'I') preLoad(rowIndex() + 5)
        }, { defer: true }))
        window.userData.backgroundAudio.src = ''
        clickLock(true)
        for (let x = 0; x < props.propRowIndex; x++) {
            if (x === props.propRowIndex - 1) state.now = 'R'
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
        if (state.now !== 'I') {
            util.onActStart(() => {
                logger.info(`开始执行第${rowIndex()}幕...`)
                util.onActEnd(() => {
                    logger.info('执行结束')
                })
            })
        }
        if (state.actRunning()) {
            logger.info('二次点击,立即执行全部回调')
            state.bridge.immedExec()
            return
        }
        rowIndex(rowIndex() + 1)
        state.actStart()
        // 考虑在主界面就获取并处理剧本?
        for (let i of book[rowIndex()]) {
            await commands[i['@']]['R'](i)
        }
        state.actEnd()
    }

    // todo:文本框允许css,并使用宏实现默认文本框
    // todo:空格等省力的点击方式
    return <canvas id="canvas" width="1280" height="720" onclick={() => clickLock() ? '' : click} />
}
