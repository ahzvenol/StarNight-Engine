import type { Component } from 'solid-js'
import { Switch, Match } from 'solid-js'

import './util/implicit'
import UI from './ui'
import store from './store'

// 整个配置文件在这里分发
const App: Component = () =>
    <Switch>
        <Match when={store.state === 'pending' || store.state === 'unresolved'}>
            <></>
        </Match>
        <Match when={store.state === 'ready'}>
            <UI environment={store()!} />
        </Match>
        <Match when={store.state === 'errored'}>
            <div>{store.error}</div>
        </Match>
    </Switch>

export default App
