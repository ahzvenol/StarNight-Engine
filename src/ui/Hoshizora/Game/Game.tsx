import type { Component } from 'solid-js'
import type { GameUIElement } from '@/core/Core'
import { Show } from 'solid-js'
import { Core, useEvents } from '@/core/Core'
import { useSignal } from '@/utils/Reactive'
import { Backlog } from './Backlog'
import { ControlPanel } from './ControlPanel'
import { Stage } from './Stage'
import { TextBox } from './TextBox'
import { Video } from './Video'

const GameUI: GameUIElement = () => {
    const showBacklog = useSignal(false)
    const showBottomBox = useSignal(true)
    const click = useEvents().click
    return (
        <div style={{ display: 'contents' }} onClick={() => (showBottomBox() ? click() : showBottomBox(true))}>
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

const Game: Component = () => <Core startAt={1}>{GameUI}</Core>

export default Game
