import { GameScopedCommand } from "@/core/Command"

let promise!: Promise<void>

const paddingPromise = new Promise<void>(() => { })

const afterInit = () => promise = paddingPromise

const run = () => () => promise = Promise.resolve()

export const Continue = { afterInit, run }

export const onContinue = () => promise.then(() => promise = paddingPromise)