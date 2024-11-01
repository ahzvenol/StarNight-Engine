import type { JSX } from 'solid-js'
import type { ReactiveStore } from './default'
import { createContext, useContext } from 'solid-js'

const storeContext = createContext<ReactiveStore>()

const useStore = () => useContext(storeContext)!

const Context = <U extends JSX.Element>(props: { environment: ReactiveStore; children: U }) => (
    <storeContext.Provider value={props.environment}>{props.children}</storeContext.Provider>
)

export { Context, useStore }
