import type { Component, ParentProps } from 'solid-js'
import styles from './Menu.module.scss'
import { MenuPanel } from './MenuPanel'

const Menu: Component<ParentProps> = (props) => {
    return (
        <>
            <div class={styles.Menu_main}>
                <div class={styles.Menu_TagContent}>{props.children}</div>
                <MenuPanel />
            </div>
        </>
    )
}

export default Menu
