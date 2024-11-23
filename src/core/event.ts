import type { GameRuntimeContext } from './type'
import { log } from '@/utils/Logger'
import { EventDispatcher, on } from './EventDispatcher'

export function createButtonEventDispatchers() {
    const primaryClickEvent = new EventDispatcher<void>()
    const fastButtonClickEvent = new EventDispatcher<void>()
    const autoButtonClickEvent = new EventDispatcher<void>()
    const onClick = on(primaryClickEvent)
    const onFast = on(fastButtonClickEvent)
    const onAuto = on(autoButtonClickEvent)
    primaryClickEvent.subscribe(() => log.info('触发点击事件'))
    fastButtonClickEvent.subscribe(() => log.info('触发快进事件'))
    autoButtonClickEvent.subscribe(() => log.info('触发自动事件'))

    return { click: primaryClickEvent, fast: fastButtonClickEvent, auto: autoButtonClickEvent, onClick, onFast, onAuto }
}

export const PreInitEvent = new EventDispatcher<void>()
export const onPreInit = on(PreInitEvent)

export const PostInitEvent = new EventDispatcher<void>()
export const onPostInit = on(PostInitEvent)

export const LeftEvent = new EventDispatcher<void>()
export const onLeft = on(LeftEvent)

export const DeactivatedEvent = new EventDispatcher<void>()
export const onDeactivated = on(DeactivatedEvent)

export const ActivatedEvent = new EventDispatcher<void>()
export const onActivated = on(ActivatedEvent)

export const DestoryedEvent = new EventDispatcher<void>()
export const onDestoryed = on(DestoryedEvent)

export const ActStartEvent = new EventDispatcher<GameRuntimeContext>()
export const onActStart = on(ActStartEvent)

export const ActEndEvent = new EventDispatcher<GameRuntimeContext>()
export const onActEnd = on(ActEndEvent)

export const ActSecondClickEvent = new EventDispatcher<GameRuntimeContext>()
export const onActSecondClick = on(ActSecondClickEvent)

ActStartEvent.subscribe((context) => log.info(`开始执行第${context.index}幕...`))
ActEndEvent.subscribe((context) => log.info(`第${context.index}幕执行结束`))
ActSecondClickEvent.subscribe(() => log.info('一幕内第二次点击,立即执行'))
