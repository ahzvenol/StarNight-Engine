import { Reactive, useReactive } from 'micro-reactive'
import { Component, Show } from 'solid-js'
import { Button } from '../Elements'
import styles from './globalDialog.module.scss'



interface IShowGlobalDialogProps {
  title: string
  leftText: string
  rightText: string
  leftFunc?: Function
  rightFunc?: Function
}

const DialogContent = useReactive(null) as Reactive<IShowGlobalDialogProps | null>

const useDialog = (props: IShowGlobalDialogProps) => DialogContent(props)

// 虽然可以使用<Portal/>但是目前觉得显式的放置在UI顶层更加清晰
const Dialog: Component = () =>
(<Show when={DialogContent() !== null}>
  <div class={styles.GlobalDialog_main}>
    <div class={styles.glabalDialog_container}>
      <div class={styles.glabalDialog_container_inner}>
        <div class={styles.title}>{DialogContent()?.title}</div>
        <div class={styles.button_list}>
          <Button class={styles.button} onClick={() => { DialogContent()!.leftFunc?.(); DialogContent(null) }}>
            {DialogContent()?.leftText}
          </Button>
          <Button class={styles.button} onClick={() => { DialogContent()!.rightFunc?.(); DialogContent(null) }}>
            {DialogContent()?.rightText}
          </Button>
        </div>
      </div>
    </div>
  </div>
</Show>
)


export default Dialog

export { useDialog }
