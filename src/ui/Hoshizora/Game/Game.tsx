import { Core, GameUIElement } from '@/core/Core'
import { TextBox } from './TextBox'
import { Component, Show } from 'solid-js'
import { ControlPanel } from './ControlPanel'
import { Backlog } from './Backlog'
import { useSignal } from '@/utils/Reactive'

const GameUI: GameUIElement = (canvans, variables) => {
    const showBacklog = useSignal(false)
    return (
        <>
            <div style={{ display: 'contents' }}>{canvans}</div>
            {/* <div style={{ width: '100%', height: '100%', 'background-color': 'white' }} /> */}
            <Show when={!showBacklog()}>
                <TextBox variables={variables} />
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
