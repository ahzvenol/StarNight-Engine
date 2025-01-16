import type { GameRuntimeContext } from './types/Game'
import { router } from '@/router'
import { Pages } from '@/ui/Type'
import { log } from '@/utils/logger'
import { GameState } from './types/Game'
import { EventDispatcher, on } from './utils/EventDispatcher'

export const PreInitEvent = new EventDispatcher<void>()
export const onPreInit = on(PreInitEvent)

export const PostInitEvent = new EventDispatcher<{ index: number }>()
export const onPostInit = on(PostInitEvent)

PreInitEvent.subscribe(() => log.info('Game:初始化开始'))
PostInitEvent.subscribe(() => log.info('Game:初始化完成'))

// 用户完全离开应用（切换到其他应用、关闭浏览器、最小化等）
export const AppLeaveEvent = new EventDispatcher<void>()
export const onAppLeave = on(AppLeaveEvent)
// 用户回到应用（从后台切回、重新打开窗口）
export const AppEnterEvent = new EventDispatcher<void>()
export const onAppEnter = on(AppEnterEvent)
// 用户离开游戏页面（但仍在游戏内，如进入设置、存档页、Backlog）
export const GameDeactivateEvent = new EventDispatcher<void>()
export const onGameDeactivate = on(GameDeactivateEvent)
// 用户回到游戏页面（如从设置、存档页、Backlog中返回）
export const GameActivateEvent = new EventDispatcher<void>()
export const onGameActivate = on(GameActivateEvent)
// 用户返回标题页
export const ReturnToTitleEvent = new EventDispatcher<void>()
export const onReturnToTitle = on(ReturnToTitleEvent)
// 用户从标题页点击继续游戏
export const ContinueGameEvent = new EventDispatcher<void>()
export const onContinueGame = on(ContinueGameEvent)
// 游戏可见性改变的事件
export const GameVisibilityEvent = new EventDispatcher<boolean>()
export const onGameVisibilityChange = on(GameVisibilityEvent)

AppLeaveEvent.subscribe(() => log.info('App:用户离开应用'))
AppEnterEvent.subscribe(() => log.info('App:用户回到应用'))
GameDeactivateEvent.subscribe(() => log.info('Game:用户离开游戏页面'))
GameActivateEvent.subscribe(() => log.info('Game:用户回到游戏页面'))
ReturnToTitleEvent.subscribe(() => log.info('Game:用户返回标题页'))
ContinueGameEvent.subscribe(() => log.info('Game: 用户从标题页继续游戏'))
AppLeaveEvent.subscribe(() => router.active() === Pages.Game && GameVisibilityEvent.publish(false))
AppEnterEvent.subscribe(() => router.active() === Pages.Game && GameVisibilityEvent.publish(true))
GameDeactivateEvent.subscribe(() => GameVisibilityEvent.publish(false))
GameActivateEvent.subscribe(() => GameVisibilityEvent.publish(true))
ReturnToTitleEvent.subscribe(() => GameVisibilityEvent.publish(false))
ContinueGameEvent.subscribe(() => GameVisibilityEvent.publish(true))
GameVisibilityEvent.subscribe((visible) => log.info(`Game:游戏可见性变动:${visible}`))

// 同时只会存在一个游戏实例,用户开始新游戏时:
// 先触发CleanupEvent,接着触发MountEvent
// 如果不存在旧的游戏实例,CleanupEvent不会触发
// 新游戏实例挂载的事件
export const GameMountEvent = new EventDispatcher<void>()
export const onGameMount = on(GameMountEvent)
// 旧游戏实例销毁的事件
export const GameCleanupEvent = new EventDispatcher<void>()
export const onGameCleanup = on(GameCleanupEvent)

GameMountEvent.subscribe(() => log.info('Game:组件挂载'))
GameCleanupEvent.subscribe(() => log.info('Game:游戏销毁'))

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

GameCleanupEvent.subscribe(GameClickEvent.unsubscribeAll)
GameCleanupEvent.subscribe(FastButtonClickEvent.unsubscribeAll)
GameCleanupEvent.subscribe(AutoButtonClickEvent.unsubscribeAll)
GameMountEvent.subscribe(() => GameClickEvent.subscribe(() => log.info('触发点击事件')))
GameMountEvent.subscribe(() => FastButtonClickEvent.subscribe(() => log.info('点击快进模式按钮')))
GameMountEvent.subscribe(() => AutoButtonClickEvent.subscribe(() => log.info('点击自动模式按钮')))
