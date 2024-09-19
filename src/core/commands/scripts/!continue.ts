import { ActScopedCommand, CommandRunFunction, State } from "@/core/Command"

let promise!: Promise<void>

const paddingPromise = new Promise<void>(() => { })

const onActStart = () => promise = paddingPromise

const run: CommandRunFunction = ({ state }) => () => {
    if (state !== State.Init) {
        promise = Promise.resolve()
    }
}

export const Continue: ActScopedCommand = { onActStart, run }

export const onContinue = () => promise