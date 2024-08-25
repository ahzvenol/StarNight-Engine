import { JSX, createContext, useContext } from "solid-js"
import { Store } from "./default"

const storeContext = createContext<Store>()

const useStore = () => useContext(storeContext)!

const Context = <U extends JSX.Element>
    (props: { environment: Store, children: U }) =>
    <storeContext.Provider value={props.environment}>{props.children}</storeContext.Provider>

export { Context, useStore }