import { useStore } from '@/store/context'
import { log } from '@/utils/Logger'
import { useSignal } from '@/utils/Reactive'
import { useEventListener } from '@/utils/useEventListener'
import { once, range, throttle } from 'es-toolkit'
import { Component, createContext, JSX, onMount, useContext } from 'solid-js'
import { GameContext, State } from './Command'
import { EventDispatcher, on } from './EventDispatcher'
import { Timer } from './Timer'
import { runLoop } from './act'
import { commands, hooks } from './commands'
import { book } from '@/store/book'

export type Variables = Record<string, unknown>

export type Events = { click: Function0<void>; fast: Function0<void>; auto: Function0<void> }

export type GameUIElement = Function1<HTMLCanvasElement, JSX.Element>

const EventsContext = createContext<Events>()
const VariablesContext = createContext<Variables>()
export const useEvents = () => useContext(EventsContext)!
export const useVariables = () => useContext(VariablesContext)!

export const Core: Component<{ startAt: number; children: GameUIElement }> = ({ startAt, children }) => {
    startAt = 165

    const store = useStore()

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
    gameClickEvent.subscribe(() => log.info('触发点击事件'))
    fastButtonClickEvent.subscribe(() => log.info('触发快进事件'))
    autoButtonClickEvent.subscribe(() => log.info('触发自动事件'))
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

    const variables = {}

    const canvans = (<canvas id="canvas" width="1280" height="720" />) as HTMLCanvasElement

    const mount = once(async () => {
        const stage = new createjs.Stage(canvans)
        createjs.Ticker.addEventListener('tick', stage)

        const context: GameContext = { stage, variables, store: store() }
        // clickLock(true)
        const timer = new Timer()
        timer.toImmediate()
        hooks.forEach((hook) => hook.beforeInit?.(context))
        // const context = { timer, state: State.Init }
        // book.forEach(e => e.forEach(i => { if (i['@'] === 'sign') sign(i) }))
        range(0, startAt).forEach(async (row) =>
            (await book)[row].forEach((i) => commands[i['@']]?.({ row, timer, state: State.Init, ...context })(i))
        )
        // 初始化过程中有一些使用了Promise包装的命令,先让它们执行完毕再进行接下来的步骤
        setTimeout(() => hooks.forEach((hook) => hook.afterInit?.(context)))
        // 幕循环的第一次运行没有任何条件,所以不需要推动
        setTimeout(() => runLoop(row, state, store, stage, onClick, onAuto, onFast))
        // clickLock(false)
    })

    // solid-keep-alive + micro-reactive
    // 在设置页修改reactive变量之后会导致mount重复触发,所以务必用once包裹
    onMount(mount)

    return (
        <EventsContext.Provider value={events}>
            <VariablesContext.Provider value={variables}>{children(canvans)}</VariablesContext.Provider>
        </EventsContext.Provider>
    )
}
