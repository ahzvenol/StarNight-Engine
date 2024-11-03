import type { Component } from 'solid-js'
import { throttle } from 'es-toolkit'
import { Show } from 'solid-js'
import { clickState, EventState } from '@/core/commands/script/click'
import { Core, useEvents } from '@/core/Core'
import { useSignal } from '@/utils/Reactive'
import { useKeyPress } from '@/utils/useKeyPress'
import { Backlog } from './Backlog'
import { ControlPanel } from './ControlPanel'
import { Stage } from './Stage'
import { TextBox } from './TextBox'
import { Video } from './Video'

const GameUI: Component = () => {
    console.log('GameUI组件发生函数调用')
    const showBacklog = useSignal(false)
    const showBottomBox = useSignal(true)

    const enable = () => clickState() === EventState.Enabled

    // 在两个位置管理用户点击:
    // 设置pointer-events以屏蔽整个GameUI的onClick触发
    // 在触发click之前判断状态适用于事件被分发到其他按键的情况
    const click = ((throttledClick) => () => {
        if (enable()) throttledClick()
    })(
        // 为点击设置0.1秒节流,防止过快点击,同时使用匿名函数防止这个临时变量被错误调用
        throttle(useEvents().click, 100, { edges: ['leading'] })
    )
    // 允许使用空格键代替鼠标
    useKeyPress('Space', click)
    return (
        <div
            style={{
                display: 'contents',
                'pointer-events': enable() ? 'auto' : 'none'
            }}
            onClick={() => (showBottomBox() ? click() : showBottomBox(true))}>
            <Stage />
            <Show when={!showBacklog() && showBottomBox()}>
                <TextBox />
                <ControlPanel showBacklog={showBacklog} showBottomBox={showBottomBox} />
            </Show>
            <Show when={showBacklog()}>
                <Backlog showBacklog={showBacklog} />
            </Show>
            <Video />
        </div>
    )
}

const Game: Component = () => (
    <Core>
        <GameUI />
    </Core>
)

export default Game
