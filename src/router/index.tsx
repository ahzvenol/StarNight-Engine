import { logger } from "@/utils/Logger"
import { useSignal } from "@/utils/Reactive"
import { isFunction, isString } from "es-toolkit"
import { JSX, ParentProps, Show, createEffect } from "solid-js"

const active = useSignal("")

createEffect(() => logger.info(`页面跳转:${active()}`))

const history = [""]

const navigate = (to: string, replace?: boolean) => { if (!replace) history.push(to); active(to) }

const back = () => { history.pop(); active(history.pop() ?? "") }

function Route(props: ParentProps<{ path: string }>): JSX.Element
function Route(props: ParentProps<{ when: (path: string) => boolean }>): JSX.Element
function Route(props: any): JSX.Element {
    if (isString(props.path)) return <Show when={active() === props.path}>{props.children}</Show>
    if (isFunction(props.when)) return <Show when={props.when(active())}>{props.children}</Show>
}

const router = { active, history, navigate, back }
export { Route, router }
