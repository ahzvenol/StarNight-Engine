import { log } from '@/utils/Logger'
import { EventDispatcher, on } from './EventDispatcher'

export function createEventDispatchers() {
    const gameClickEvent = new EventDispatcher<void>()
    const fastButtonClickEvent = new EventDispatcher<void>()
    const autoButtonClickEvent = new EventDispatcher<void>()
    const onClick = on(gameClickEvent)
    const onFast = on(fastButtonClickEvent)
    const onAuto = on(autoButtonClickEvent)
    gameClickEvent.subscribe(() => log.info('触发点击事件'))
    fastButtonClickEvent.subscribe(() => log.info('触发快进事件'))
    autoButtonClickEvent.subscribe(() => log.info('触发自动事件'))

    return { click: gameClickEvent, fast: fastButtonClickEvent, auto: autoButtonClickEvent, onClick, onFast, onAuto }
}
