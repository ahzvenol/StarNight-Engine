import type { GameRuntimeContext } from './types/Game'
import { log } from '@/utils/logger'
import { GameState } from './types/Game'
import { EventDispatcher, on } from './utils/EventDispatcher'

export function createButtonEventDispatchers() {
    const primaryClickEvent = new EventDispatcher<void>()
    const fastButtonClickEvent = new EventDispatcher<void>()
    const autoButtonClickEvent = new EventDispatcher<void>()
    const onClick = on(primaryClickEvent)
    const onFast = on(fastButtonClickEvent)
    const onAuto = on(autoButtonClickEvent)
    primaryClickEvent.subscribe(() => log.info('触发点击事件'))
    fastButtonClickEvent.subscribe(() => log.info('点击快进模式按钮'))
    autoButtonClickEvent.subscribe(() => log.info('点击自动模式按钮'))

    return { click: primaryClickEvent, fast: fastButtonClickEvent, auto: autoButtonClickEvent, onClick, onFast, onAuto }
}

export const PreInitEvent = new EventDispatcher<void>()
export const onPreInit = on(PreInitEvent)

export const PostInitEvent = new EventDispatcher<void>()
export const onPostInit = on(PostInitEvent)

PreInitEvent.subscribe(() => log.info('Game:初始化开始'))
PostInitEvent.subscribe(() => log.info('Game:初始化完成'))

export const MountEvent = new EventDispatcher<void>()
export const onMount = on(MountEvent)

export const LeaveEvent = new EventDispatcher<void>()
export const onLeave = on(LeaveEvent)

export const DeactivateEvent = new EventDispatcher<void>()
export const onDeactivate = on(DeactivateEvent)

export const ActivateEvent = new EventDispatcher<void>()
export const onActivate = on(ActivateEvent)

export const CleanupEvent = new EventDispatcher<void>()
export const onCleanup = on(CleanupEvent)

MountEvent.subscribe(() => log.info('Game:组件挂载'))
LeaveEvent.subscribe(() => log.info('Game:用户回到标题页'))
DeactivateEvent.subscribe(() => log.info('Game:用户离开游戏页面'))
ActivateEvent.subscribe(() => log.info('Game:用户回到游戏页面'))
CleanupEvent.subscribe(() => log.info('Game:游戏销毁'))

export const ActStartEvent = new EventDispatcher<GameRuntimeContext>()
export const onActStart = on(ActStartEvent)

export const ActEndEvent = new EventDispatcher<GameRuntimeContext>()
export const onActEnd = on(ActEndEvent)

export const ActSecondClickEvent = new EventDispatcher<GameRuntimeContext>()
export const onActSecondClick = on(ActSecondClickEvent)

ActStartEvent.subscribe((context) =>
    context.state === GameState.Init
        ? log.info(`正在初始化第${context.index}幕`)
        : log.info(`开始执行第${context.index}幕...`)
)
ActEndEvent.subscribe((context) => context.state !== GameState.Init && log.info(`第${context.index}幕执行结束`))
ActSecondClickEvent.subscribe(() => log.info('一幕内第二次点击,立即执行'))
