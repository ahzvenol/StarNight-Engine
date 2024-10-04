import { Core, GameUIElement, useEvents } from '@/core/Core'
import { TextBox } from './TextBox'
import { Component, Show } from 'solid-js'
import { ControlPanel } from './ControlPanel'
import { Backlog } from './Backlog'
import { useSignal } from '@/utils/Reactive'

const GameUI: GameUIElement = (canvans) => {
    const showBacklog = useSignal(false)
    const click = useEvents().click
    return (
        <>
            <div style={{ display: 'contents' }} onClick={click}>
                {canvans}
            </div>
            {/* <div style={{ width: '100%', height: '100%', 'background-color': 'white' }} /> */}
            <Show when={!showBacklog()}>
                <TextBox />
                <ControlPanel showBacklog={showBacklog} />
            </Show>
            <Show when={showBacklog()}>
                <Backlog showBacklog={showBacklog} />
            </Show>
        </>
    )
}

const Game: Component = () => <Core startAt={0}>{GameUI}</Core>

export default Game
