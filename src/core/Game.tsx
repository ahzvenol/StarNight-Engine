import { Component } from 'solid-js'
import { Core, GameUIElement } from './Core'
import { TextBox } from './ui/TextBoxS'

const startGame = () => {}

const GameUI: GameUIElement = (canvans, variables) => {
    return (
        <>
            <div style={{ 'z-index': 11, width: '100%', height: '100%' }}>
                <TextBox variables={variables} />
            </div>
            <div style={{ 'z-index': 10, width: '100%', height: '100%' }}>{canvans}</div>
        </>
    )
}

const Game: Component = () => <Core startAt={0}>{GameUI}</Core>

export default Game
