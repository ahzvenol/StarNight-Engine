import { router } from "@/router"
import { Button } from "@/ui/Elements"
import { Component } from "solid-js"
import styles from './Back.module.scss'

const Back: Component = () => <Button class={styles.Back_style} onclick={router.back} />