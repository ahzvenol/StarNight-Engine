import styles from './menu.module.scss'
import { Component, ParentProps } from 'solid-js'

/**
 * Menu 页面，包括存读档、选项等
 */
const Menu: Component<ParentProps> = ({ children }) => {
  return (
    <>
      <div class={styles.Menu_main}>
        <div class={styles.Menu_TagContent}>{children}</div>
        {/* <MenuPanel /> */}
      </div>
    </>
  )
}

export default Menu
