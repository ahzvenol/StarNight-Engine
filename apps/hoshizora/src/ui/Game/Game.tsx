import type { GameLocalData } from '@starnight/core'
import type { Component, ParentProps } from 'solid-js'
import { StarNight } from '@starnight/core'
import { throttle } from 'es-toolkit'
import { useSignal } from 'micro-reactive-solid'
import { onCleanup, Show } from 'solid-js'
import { SwitchState } from '@/core/SwitchState'
import { onStoreReady } from '@/store'
import { book, starnight, ui } from '@/store/starnight'
import { Content } from '@/utils/ui/Elements'
import { log } from '@/utils/Logger'
import { KeepAlive } from '@/utils/solid/KeepAlive'
import { useKeyPress } from '@/utils/solid/useKeyPress'
import { AudioIds, AudioMutex, BGM, Clip, SE, UISE } from '../Audio'
import { Pages } from '../Pages'
import { Backlog } from './Backlog'
import { Blind } from './Blind'
import { Choice } from './Choice'
import { ControlPanel } from './ControlPanel'
import { Stage } from './Stage'
import { TextBox } from './TextBox'
import { Video } from './Video'

export const restartGame = async (local: GameLocalData) => {
    const store = await onStoreReady
    starnight(
        StarNight.instance({
            book: await book,
            config: store.config,
            local: local,
            global: store.global,
            ui: { audiotracks: { BGM, SE, Clip, UISE } }
        })
    )
}

export const gameRef = useSignal<HTMLDivElement | null>(null)

const Game: Component = () => {
    log.info('GameUI组件函数被调用')

    AudioMutex(AudioIds.Game)
    starnight().start()
    onCleanup(starnight().stop)

    const displayBacklog = useSignal(false)
    const displayBottomBox = useSignal(true)

    // 在两个位置管理用户点击:
    // 设置pointer-events以屏蔽整个GameUI的onClick触发
    // 在触发click之前判断状态适用于函数被其他键盘事件调用的情况
    const enable = () => ui().clickstate() === SwitchState.Enabled
    // 为点击设置0.1秒节流
    const click = throttle(
        () => {
            if (enable()) {
                if (starnight().state.isFast()) {
                    starnight().ClickEvents.fast.publish()
                } else {
                    starnight().ClickEvents.step.publish()
                }
            }
        },
        100,
        { edges: ['leading'] }
    )
    // 允许使用空格键,回车键代替鼠标
    useKeyPress('Space', click)
    useKeyPress('Enter', click)

    return (
        <Content
            ref={gameRef}
            style={{ 'pointer-events': enable() ? 'auto' : 'none' }}
            onClick={() =>
                displayBottomBox() || ui().clickstate() === SwitchState.Disabled ? click() : displayBottomBox(true)
            }
            onContextMenu={() => displayBottomBox((b) => !b)}>
            <Stage />
            <Show when={!displayBacklog() && displayBottomBox() && ui().textboxstate() === SwitchState.Enabled}>
                <Show when={ui().textboxstate() === SwitchState.Enabled}>
                    <TextBox />
                </Show>
                <ControlPanel showBacklog={() => displayBacklog(true)} closeBottomBox={() => displayBottomBox(false)} />
            </Show>
            <Blind />
            <Show when={displayBacklog()}>
                <Backlog closeBacklog={() => displayBacklog(false)} />
            </Show>
            <Video />
            <Choice />
        </Content>
    )
}

const KeepAliveGame: Component<ParentProps> = () => {
    return (
        <KeepAlive id={Pages.Game} key={starnight}>
            <Game />
        </KeepAlive>
    )
}

export default KeepAliveGame
