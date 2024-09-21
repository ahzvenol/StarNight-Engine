import { Component } from "solid-js"
import { Core, GameUIElement } from "./Core"
import { TextBox } from "./ui/TextBoxS"

const startGame = () => { }

const GameUI: GameUIElement = (canvans, variables) => {
    return <div style={{ position: 'absolute' }}>
        <TextBox variables={variables} />
        {canvans}
    </div>
}

const Game: Component =
    () =>
        <Core startAt={0}>
            {GameUI}
        </Core>

export default Game