import { Reactive, useReactive } from "micro-reactive"
import { preLoad } from "public/old/store/preload"
import { JSX, Component, createEffect, on, onMount } from "solid-js"
import { State } from "./new"
import { EventDispatcher } from "@/utils"
import Timer from "./timer"
import { Store } from "@/store"
import createjs from "createjs-npm"
import { Tween, Container } from "./creater"
import { range } from "@/utils/range"

type GameUIElement = Function2<HTMLCanvasElement, Reactive<Dictionary<string>>, JSX.Element>
type GameContext = {
    store: Store,
    runtime: {
        state: Reactive<State>,
        actIndex: Reactive<number>,
        tween: Tween,
        container: Container,
        setTimeout: (callback: Function0<void>, ms: number) => void,
        delay: (wait: number) => Promise<void>,
    }
    variable: Reactive<Dictionary>,
    save: { global: Reactive<Dictionary>, individual: Dictionary }
}

const Core: Component<{ propIndex: number, children: GameUIElement }> =
    ({ propIndex, children }) => {
        const actIndex = useReactive(propIndex)
        const state = useReactive(State.Init)
        const clickLock = useReactive(false)

        createEffect(on(actIndex, () => {
            // tag:可能需要一些更复杂的分支预测机制
            if (state() !== State.Init) preLoad(actIndex() + 5)
        }, { defer: true }))

        const gameClickEvent = new EventDispatcher<void>()
        const fastButtonClickEvent = new EventDispatcher<void>()
        const autoButtonClickEvent = new EventDispatcher<void>()
        // fastButtonClickEvent.subscribe(gameClickEvent.publish)
        // tag:没做模式的toNormal
        fastButtonClickEvent.subscribe(() => state(State.Fast))
        autoButtonClickEvent.subscribe(() => state(State.Auto))

        onMount(() => {
            // clickLock(true)
            BGM.src = ''
            const timer = new Timer()
            timer.toImmediate()
            range(0, propIndex).forEach(i => book[i].forEach(i => commands[i['@']]?.(context)(i)))
            // todo:对副作用初始化
            state(State.Normal)
            gameClickEvent.publish()
            runActLoop()
            // clickLock(false)
        })

        const canvans = <canvas id="canvas" width="1280" height="720" onclick={() => clickLock() ? '' : gameClickEvent.publish()} />
        // 在这里需要命令和UI达成统一,在Game中挂载对应的变量到全局变量区,同时在UI中使用它
        const variable = useReactive({}) as Reactive<Dictionary>

        // todo:空格等省力的点击方式
        return children(canvans as HTMLCanvasElement, variable)
    }


export default Core