import type { Component } from 'solid-js'
import { Button } from '../Button'
import styles from './Back.module.scss'

const Back: Component<{ onClick: Function0<void> }> = (props) => (
    <Button class={styles.Back_style} onClick={props.onClick} />
)

export default Back
