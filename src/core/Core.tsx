import { BGM } from '@/store/effect/audioManager'
import { logger } from '@/utils/Logger'
import { useSignal } from '@/utils/Reactive'
import { useEventListener } from '@/utils/useEventListener'
import { mapValues, throttle } from 'es-toolkit'
import { Reactive, useReactive } from 'micro-reactive'
import { Component, createContext, JSX, onMount, useContext } from 'solid-js'
import { GameContext, State } from './Command'
import { EventDispatcher, on } from './EventDispatcher'
import { Timer } from './Timer'
import { runLoop } from './act'
import { commands } from './commands'

export type Variables = Record<string, any> & {
    reactive: Reactive<Record<string, any>>
}

export type Events = { click: Function0<void>; fast: Function0<void>; auto: Function0<void> }

export type GameUIElement = Function1<HTMLCanvasElement, JSX.Element>

const EventsContext = createContext<Events>()
const VariablesContext = createContext<Variables>()
export const useEvents = () => useContext(EventsContext)!
export const useVariables = () => useContext(VariablesContext)!

export const Core: Component<{ startAt: number; children: GameUIElement }> = ({ startAt, children }) => {
    const row = useSignal(startAt)
    // tag:可能需要一些更复杂的分支预测机制
    // createEffect(() => preLoad(row() + 5))

    const clickLock = useSignal(false)

    const gameClickEvent = new EventDispatcher<void>()
    const fastButtonClickEvent = new EventDispatcher<void>()
    const autoButtonClickEvent = new EventDispatcher<void>()
    const onClick = on(gameClickEvent)
    const onFast = on(fastButtonClickEvent)
    const onAuto = on(autoButtonClickEvent)
    gameClickEvent.subscribe(() => logger.info('触发点击事件'))
    fastButtonClickEvent.subscribe(() => logger.info('触发快进事件'))
    autoButtonClickEvent.subscribe(() => logger.info('触发自动事件'))
    // 0.1秒点击锁，防止过快点击
    const emitClickEvent = throttle(
        () => {
            if (!clickLock()) {
                gameClickEvent.publish()
            }
        },
        100,
        { edges: ['leading'] }
    )
    // 空格等点击方式
    let spacePressed = false
    useEventListener('keydown', (event) => {
        if (event.code === 'Space' && !spacePressed) {
            spacePressed = true
            emitClickEvent()
        }
    })
    useEventListener('keyup', (event) => {
        if (event.code === 'Space') {
            spacePressed = false
        }
    })
    const events: Events = {
        click: emitClickEvent,
        fast: fastButtonClickEvent.publish,
        auto: autoButtonClickEvent.publish
    }

    const state = useSignal(State.Normal)
    fastButtonClickEvent.subscribe(() => state(state() === State.Fast ? State.Normal : State.Fast))
    autoButtonClickEvent.subscribe(() => state(state() === State.Auto ? State.Normal : State.Auto))

    // 在这里需要命令和UI达成统一,在Game中挂载对应的变量到全局变量区,同时在UI中使用它
    const variables = { reactive: useReactive<Record<string, any>>({}) }

    const canvans = (<canvas id="canvas" width="1280" height="720" />) as HTMLCanvasElement

    onMount(() => {
        const stage = new createjs.Stage(canvans)
        const context: GameContext = { stage, variables }
        // clickLock(true)
        BGM.src = ''
        const timer = new Timer()
        timer.toImmediate()
        mapValues(commands, (command) => command.beforeInit?.(context))
        // const context = { timer, state: State.Init }
        // book.forEach(e => e.forEach(i => { if (i['@'] === 'sign') sign(i) }))
        // range(0, startAt).forEach(row => book[row].forEach(i => commands[i['@']]?.run({ row, ...context })(i)))
        // todo:对副作用初始化
        mapValues(commands, (command) => command.afterInit?.(context))
        // 幕循环的第一次运行没有任何条件,所以不需要推动
        runLoop(row, state, onClick, onAuto, onFast)
        // clickLock(false)
    })

    return (
        <EventsContext.Provider value={events}>
            <VariablesContext.Provider value={variables}>{children(canvans)}</VariablesContext.Provider>
        </EventsContext.Provider>
    )
}