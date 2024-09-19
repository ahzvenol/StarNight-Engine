import { BGM } from "@/store/audioManager"
import { useSignal } from "@/utils/Reactive"
import { delay, mapValues, range } from "es-toolkit"
import { Reactive, useReactive } from "micro-reactive"
import { Component, JSX, createEffect, onMount } from "solid-js"
import book from "../assets/book.json"
import { State, commands } from "./Command"
import { EventDispatcher, on } from "./EventDispatcher"
import { Timer } from "./Timer"
import { runAct } from "./act"
import { match } from 'ts-pattern'

type GameUIElement = Function2<HTMLCanvasElement, Reactive<Dictionary<string>>, JSX.Element>

const Core: Component<{ startAt: number, children: GameUIElement }> =
    ({ startAt, children }) => {
        const row = useSignal(startAt)
        const clickLock = useSignal(false)

        const gameClickEvent = new EventDispatcher<void>()
        const fastButtonClickEvent = new EventDispatcher<void>()
        const autoButtonClickEvent = new EventDispatcher<void>()
        const onClick = on(gameClickEvent)
        const onFast = on(fastButtonClickEvent)
        const onAuto = on(autoButtonClickEvent)

        const state = useSignal(State.Normal)
        fastButtonClickEvent.subscribe(() => state(state() === State.Fast ? State.Normal : State.Fast))
        autoButtonClickEvent.subscribe(() => state(state() === State.Auto ? State.Normal : State.Auto))

        // 在这里需要命令和UI达成统一,在Game中挂载对应的变量到全局变量区,同时在UI中使用它
        const variable = useReactive<Dictionary>({})

        // 只有两个地方会有阻塞:正在运行一幕,等待点击事件
        // 为了更清晰的表示,用Promise.race同时监听几个事件来推进幕循环
        // auto的话,不需要去加速正在运行的幕,但是需要去推动已经停止的循环
        // 像是选项要卡死幕循环的情况,使用不在timer控制范围内的await就可以
        // fix:index需要自增,不能和jump冲突
        const loop: Function0<Promise<void>> =
            () =>
                runAct(row(), state(), onClick, onFast)
                    .then(res =>
                        (res['continue'] === true
                            ? Promise.resolve()
                            : match(state())
                                .with(State.Fast, () => delay(100))
                                .with(State.Auto, () => Promise.resolve())
                                .otherwise(() => Promise.race([
                                    onClick(),
                                    onAuto(),
                                    onFast(),
                                ]))
                        ).then(() =>
                            res['jump'] !== undefined
                                ? row(res['jump'])
                                : row(row() + 1))
                    )
                    .then(loop)

        onMount(() => {
            // clickLock(true)
            BGM.src = ''
            const timer = new Timer()
            timer.toImmediate()
            const context = { timer, state: State.Init }
            // book.forEach(e => e.forEach(i => { if (i['@'] === 'sign') sign(i) }))
            range(0, startAt).forEach(row => book[row].forEach(i => commands[i['@']]?.run({ row, ...context })(i)))
            // todo:对副作用初始化
            // @ts-expect-error
            mapValues(commands, command => command?.afterInit())
            // 幕循环的第一次运行没有任何条件,所以不需要推动
            loop()
            createEffect(() => {
                // tag:可能需要一些更复杂的分支预测机制
                preLoad(row() + 5)
            })
            // clickLock(false)
        })

        const canvans = <canvas id="canvas" width="1280" height="720" onclick={() => clickLock() ? '' : gameClickEvent.publish()} />

        // todo:空格等省力的点击方式
        return children(canvans as HTMLCanvasElement, variable)
    }


export default Core