import { Component, ParentProps } from 'solid-js'
import { MenuPanel } from './MenuPanel'
import styles from './menu.module.scss'

/**
 * Menu 页面，包括存读档、选项等
 */
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
