import { Core, GameUIElement, useEvents } from '@/core/Core'
import { useSignal } from '@/utils/Reactive'
import { Component, Show } from 'solid-js'
import { Backlog } from './Backlog'
import { ControlPanel } from './ControlPanel'
import { TextBox } from './TextBox'
import { Video } from './Video'

const GameUI: GameUIElement = (canvans) => {
    const showBacklog = useSignal(false)
    const click = useEvents().click
    return (
        <>
            <div style={{ display: 'contents' }} onClick={click}>
                {canvans}
                {/* <div style={{ width: '100%', height: '100%', 'background-color': 'white' }} /> */}
                <Show when={!showBacklog()}>
                    <TextBox />
                    <ControlPanel showBacklog={showBacklog} />
                </Show>
                <Show when={showBacklog()}>
                    <Backlog showBacklog={showBacklog} />
                </Show>
                <Video />
            </div>
        </>
    )
}

const Game: Component = () => <Core startAt={1}>{GameUI}</Core>

export default Game
