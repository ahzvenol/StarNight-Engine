import { useReactive } from "micro-reactive"
import { Component, ParentProps, Show } from "solid-js"

const active = useReactive("")

const history = [""]

const Route: Component<ParentProps<{ path: string }>> =
    ({ path, children }) => <Show when={active() === path}>{children}</Show>

const navigate = (to: string) => { history.push(to), active(to) }

const back = () => { active(history.pop() ?? "") }