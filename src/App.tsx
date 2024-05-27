import type { Component } from 'solid-js'
import { Switch, Match } from 'solid-js'

import './util/implicit'
import UI from './ui'
import store from './store'

// todo 考虑把index里的初始化下放到这里
// 整个配置文件在这里分发

// const createEnvironment: () => Promise<Reactive<ObjectMap>> = async () => useReactive({ config: 'auto' }) as unknown as Reactive<ObjectMap>
// const createEnvironment = () => useReactive({ mode: 'auto' }) as unknown as Reactive<ObjectMap>

// const App: Component = () => <div style="width: 100vw;height: 100vh;background-color: #000;"><UI graphics={UIConfig} /></div>

// const App: () => Promise<Component> = () => createEnvironment().then(environment => <UI environment={environment} />)
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
