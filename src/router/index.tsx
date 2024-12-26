import type { JSX, ParentProps } from 'solid-js'
import { isFunction, isString } from 'es-toolkit'
import { createEffect, Show } from 'solid-js'
import { log } from '@/utils/logger'
import { useSignal } from '@/utils/Reactive'

const active = useSignal('')

createEffect(() => log.info(`页面跳转:${active()}`))

const history = ['']

const navigate = (to: string, replace?: boolean) => {
    if (!replace) history.push(to)
    active(to)
}

const back = () => {
    history.pop()
    active(history[history.length - 1])
}

function Route(props: ParentProps<{ path: string }>): JSX.Element
function Route(props: ParentProps<{ when: (path: string) => boolean }>): JSX.Element
function Route(props: ParentProps<{ path?: string; when?: (path: string) => boolean }>): JSX.Element {
    if (isString(props.path)) return <Show when={active() === props.path}>{props.children}</Show>
    if (isFunction(props.when)) return <Show when={props.when(active())}>{props.children}</Show>
}

const router = { active, history, navigate, back }
export { Route, router }
