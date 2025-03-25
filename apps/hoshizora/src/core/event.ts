import type { Reactive } from '@/lib/micro-reactive'
import type { GameBook, GameConfig, GameRuntimeContext } from './types/Game'
import { omit } from 'es-toolkit'
import { log } from '@/utils/logger'
import { GameState } from './types/Game'
import { EventDispatcher, on } from './utils/EventDispatcher'

// 这些事件应只发布一次
// 初始化配置
export const SetupConfigEvent = omit(new EventDispatcher<Reactive<GameConfig>>(), ['subscribe'])
export const onSetupConfig = new Promise<Reactive<GameConfig>>((res) => SetupConfigEvent.once(res))
// 初始化剧本
export const SetupBookEvent = omit(new EventDispatcher<GameBook>(), ['subscribe'])
export const onSetupBook = new Promise<GameBook>((res) => SetupBookEvent.once(res))

SetupConfigEvent.once((config) => log.info('Engine:初始化配置为:', config()))
SetupBookEvent.once((book) => log.info('Engine:初始化剧本为:', book))

// 新游戏实例挂载的事件
// 同时只会存在一个游戏实例,用户开始新游戏时:
// 先触发CleanupEvent,接着触发MountEvent
export const GameStartEvent = new EventDispatcher<void>()
export const onGameStart = on(GameStartEvent)
// 旧游戏实例销毁的事件
export const GameDestroyEvent = new EventDispatcher<void>()
export const onGameDestroy = on(GameDestroyEvent)

GameStartEvent.subscribe(() => log.info('Game:游戏开始'))
GameDestroyEvent.subscribe(() => log.info('Game:游戏结束'))

// 游戏挂起
// 此状态下游戏的某些效果仍保持,如从游戏页面中进入设置、存档页、Backlog
export const GameSuspendEvent = new EventDispatcher<void>()
export const onGameSuspend = on(GameSuspendEvent)
// 游戏从挂起中恢复
export const GameResumeEvent = new EventDispatcher<void>()
export const onGameResume = on(GameResumeEvent)
// 游戏停止
// 此状态下游戏所有命令彻底停止,如从游戏页面中退回到标题页
export const GameSleepEvent = new EventDispatcher<void>()
export const onGameSleep = on(GameSleepEvent)
// 游戏从停止中恢复
export const GameWakeEvent = new EventDispatcher<void>()
export const onGameWake = on(GameWakeEvent)
// 游戏可见性改变的事件
export const GameVisibilityEvent = new EventDispatcher<boolean>()
export const onGameVisibilityChange = on(GameVisibilityEvent)

GameSuspendEvent.subscribe(() => log.info('Game:游戏挂起'))
GameResumeEvent.subscribe(() => log.info('Game:游戏从挂起中恢复'))
GameSleepEvent.subscribe(() => log.info('Game:游戏停止'))
GameWakeEvent.subscribe(() => log.info('Game:游戏从停止中恢复'))
GameSuspendEvent.subscribe(() => GameVisibilityEvent.publish(false))
GameResumeEvent.subscribe(() => GameVisibilityEvent.publish(true))
GameSleepEvent.subscribe(() => GameVisibilityEvent.publish(false))
GameWakeEvent.subscribe(() => GameVisibilityEvent.publish(true))
GameVisibilityEvent.subscribe((visible) => log.info(`Game:游戏可见性变动:可见性:${visible}`))

// 游戏实例初始化完毕事件
export const InitCompleteEvent = new EventDispatcher<{ index: number }>()
export const onInitComplete = on(InitCompleteEvent)

export const ActStartEvent = new EventDispatcher<GameRuntimeContext>()
export const onActStart = on(ActStartEvent)

export const ActEndEvent = new EventDispatcher<GameRuntimeContext>()
export const onActEnd = on(ActEndEvent)

export const ActSecondClickEvent = new EventDispatcher<GameRuntimeContext>()
export const onActSecondClick = on(ActSecondClickEvent)

InitCompleteEvent.subscribe(() => log.info('Game:初始化完成'))

ActStartEvent.subscribe(({ state, current: { index } }) =>
    state === GameState.Init ? log.info(`正在初始化第${index}幕`) : log.info(`开始执行第${index}幕...`)
)
ActEndEvent.subscribe(({ state, current: { index } }) => state !== GameState.Init && log.info(`第${index}幕执行结束`))
ActSecondClickEvent.subscribe(() => log.info('一幕内第二次点击,立即执行'))

export const JumpEvent = new EventDispatcher<{ index: number }>()
export const onJump = on(JumpEvent)

// 游戏点击事件
// 所有游戏实例都依赖于同一组点击事件
// 在新实例挂载时会清理订阅,以此避免影响旧实例
// 需要注意这个情况,小心使用这些事件
export const GameClickEvent = new EventDispatcher<void>()
export const onClick = on(GameClickEvent)
export const FastButtonClickEvent = new EventDispatcher<void>()
export const onFast = on(FastButtonClickEvent)
export const AutoButtonClickEvent = new EventDispatcher<void>()
export const onAuto = on(AutoButtonClickEvent)

GameDestroyEvent.subscribe(GameClickEvent.unsubscribeAll)
GameDestroyEvent.subscribe(FastButtonClickEvent.unsubscribeAll)
GameDestroyEvent.subscribe(AutoButtonClickEvent.unsubscribeAll)
GameStartEvent.subscribe(() => GameClickEvent.subscribe(() => log.info('触发点击事件')))
GameStartEvent.subscribe(() => FastButtonClickEvent.subscribe(() => log.info('点击快进模式按钮')))
GameStartEvent.subscribe(() => AutoButtonClickEvent.subscribe(() => log.info('点击自动模式按钮')))
