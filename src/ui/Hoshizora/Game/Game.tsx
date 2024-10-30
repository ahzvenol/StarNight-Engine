import { Core, GameUIElement, useEvents } from '@/core/Core'
import { useSignal } from '@/utils/Reactive'
import { Component, Show } from 'solid-js'
import { Backlog } from './Backlog'
import { ControlPanel } from './ControlPanel'
import { TextBox } from './TextBox'
import { Video } from './Video'
import { Stage } from './Stage'

const GameUI: GameUIElement = () => {
    const showBacklog = useSignal(false)
    const click = useEvents().click
    return (
        <div style={{ display: 'contents' }} onClick={click}>
            <Stage />
            <Show when={!showBacklog()}>
                <TextBox />
                <ControlPanel showBacklog={showBacklog} />
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
