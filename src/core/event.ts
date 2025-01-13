import type { GameRuntimeContext } from './types/Game'
import { log } from '@/utils/logger'
import { GameState } from './types/Game'
import { EventDispatcher, on } from './utils/EventDispatcher'

export const PreInitEvent = new EventDispatcher<void>()
export const onPreInit = on(PreInitEvent)

export const PostInitEvent = new EventDispatcher<{ index: number }>()
export const onPostInit = on(PostInitEvent)

PreInitEvent.subscribe(() => log.info('Game:初始化开始'))
PostInitEvent.subscribe(() => log.info('Game:初始化完成'))

export const MountEvent = new EventDispatcher<void>()
export const onMount = on(MountEvent)
// 用户回到主页的事件,此时内容由起始页接管
export const LeaveEvent = new EventDispatcher<void>()
export const onLeave = on(LeaveEvent)
// 用户离开游戏页面的事件,可能是前往设置页,存档页等页面,通过点击返回还会回到游戏中
export const DeactivateEvent = new EventDispatcher<void>()
export const onDeactivate = on(DeactivateEvent)
// 用户回到游戏页面的事件
export const ActivateEvent = new EventDispatcher<void>()
export const onActivate = on(ActivateEvent)
// 用户开始新游戏的事件,旧游戏实例的一切效果应销毁
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

export const JumpEvent = new EventDispatcher<{ index: number }>()
export const onJump = on(JumpEvent)

// 这些事件只在幕循环中使用,由GameUI触发,其他位置的代码不应依赖它们
// 所有游戏实例都依赖于同一组点击事件,通过在新实例挂载时清理订阅来避免影响旧实例
export const GameClickEvent = new EventDispatcher<void>()
export const onClick = on(GameClickEvent)
export const FastButtonClickEvent = new EventDispatcher<void>()
export const onFast = on(FastButtonClickEvent)
export const AutoButtonClickEvent = new EventDispatcher<void>()
export const onAuto = on(AutoButtonClickEvent)

CleanupEvent.subscribe(GameClickEvent.unsubscribeAll)
CleanupEvent.subscribe(FastButtonClickEvent.unsubscribeAll)
CleanupEvent.subscribe(AutoButtonClickEvent.unsubscribeAll)
MountEvent.subscribe(() => GameClickEvent.subscribe(() => log.info('触发点击事件')))
MountEvent.subscribe(() => FastButtonClickEvent.subscribe(() => log.info('点击快进模式按钮')))
MountEvent.subscribe(() => AutoButtonClickEvent.subscribe(() => log.info('点击自动模式按钮')))
