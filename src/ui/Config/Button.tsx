import { Reactive } from 'micro-reactive'
import { JSX, splitProps } from 'solid-js'
import { Button as BaseButton } from '../Elements'
import styles from './button.module.scss'

// 根据以前的开发经验,如果需要实现指定背景图片和缓动的按钮激活效果,一个按钮需要两个元素来实现
// flex样式不好操作,暂时先还原UI,不做更多额外工作
function Button<T>(props: { key: T, signal: Reactive<T> } & JSX.HTMLAttributes<HTMLDivElement>) {
  const [local, others] = splitProps(props, ["key", "signal", "classList", "onclick"])
  return (
    <BaseButton
      classList={{
        ...local.classList,
        [styles.NormalButton]: true,
        [styles.NormalButtonChecked]: local.signal() === local.key
      }}
      // @ts-ignore
      onclick={() => (local.signal(local.key), local.onclick?.())}
      {...others}
    />
  )
}

export default Button