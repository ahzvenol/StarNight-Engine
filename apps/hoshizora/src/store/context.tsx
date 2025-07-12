import type { JSX } from 'solid-js'
import type { ReactiveStore } from './default'
import { createContext, useContext } from 'solid-js'

const StoreContext = createContext<ReactiveStore>()

const useStore = () => useContext(StoreContext)!

const Context = <U extends JSX.Element>(props: { environment: ReactiveStore, children: U }) => (
    <StoreContext.Provider value={props.environment}>{props.children}</StoreContext.Provider>
)

export { Context, useStore }
