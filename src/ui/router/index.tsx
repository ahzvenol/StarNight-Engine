import logger from "@/utils/Logger"
import { useReactive } from "micro-reactive"
import { Component, ParentProps, Show, createEffect } from "solid-js"

const active = useReactive("")

createEffect(() => logger.info(`页面跳转:${active()}`))

const history = [""]

const Route: Component<ParentProps<{ path: string }>> =
    ({ path, children }) => <Show when={active().toLowerCase() === path.toLocaleLowerCase()}>{children}</Show>

const navigate = (to: string) => { history.push(to), active(to) }

const back = () => { active(history.pop() ?? "") }

export { active, history, Route, navigate, back }