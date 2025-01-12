import type { Component } from 'solid-js'
import { throttle } from 'es-toolkit'
import { Show } from 'solid-js'
import { clickState, EventState } from '@/core/commands/script/click'
import { displaySelectionView } from '@/core/commands/script/hoshizora/selection'
import { Core } from '@/core/Core'
import { GameClickEvent } from '@/core/event'
import { Content } from '@/ui/Elements'
import { log } from '@/utils/logger'
import { useSignal } from '@/utils/Reactive'
import { useKeyPress } from '@/utils/solid/useKeyPress'
import { Backlog } from './Backlog'
import { ControlPanel } from './ControlPanel'
import { Selection } from './Selection'
import { Stage } from './Stage'
import { TextBox } from './TextBox'
import { Video } from './Video'

const GameUI: Component = () => {
    log.info('GameUI组件函数被调用')
    const displayBacklog = useSignal(false)
    const displayBottomBox = useSignal(true)

    // 在两个位置管理用户点击:
    // 设置pointer-events以屏蔽整个GameUI的onClick触发
    // 在触发click之前判断状态适用于函数被其他键盘事件调用的情况
    const enable = () => clickState() === EventState.Enabled
    // 为点击设置0.1秒节流
    const click = throttle(
        () => {
            if (enable()) GameClickEvent.publish()
        },
        100,
        { edges: ['leading'] }
    )
    // 允许使用空格键,回车键代替鼠标
    useKeyPress('Space', click)
    useKeyPress('Enter', click)

    return (
        <Content
            style={{ 'pointer-events': enable() ? 'auto' : 'none' }}
            onClick={() => (displayBottomBox() ? click() : displayBottomBox(true))}
            onContextMenu={() => displayBottomBox((v) => !v)}>
            <Stage />
            <Show when={!displayBacklog() && displayBottomBox()}>
                <Show when={!displaySelectionView()}>
                    <TextBox />
                </Show>
                <ControlPanel showBacklog={() => displayBacklog(true)} closeBottomBox={() => displayBottomBox(false)} />
            </Show>
            <Show when={displayBacklog()}>
                <Backlog closeBacklog={() => displayBacklog(false)} />
            </Show>
            <Video />
            <Selection />
        </Content>
    )
}

const Game: Component = () => (
    <Core>
        <GameUI />
    </Core>
)

export default Game
