import type { Reactive } from 'micro-reactive'
import { createSelector, splitProps } from 'solid-js'
import { Button as BaseButton } from '@/ui/Elements'
import styles from './Button.module.scss'

// 根据以前的开发经验,如果需要实现指定背景图片和缓动的按钮激活效果,一个按钮需要两个元素来实现
// flex样式不好操作,暂时先还原UI,不做更多额外工作
function Button<T>(props: { key: T; signal: Reactive<T> } & Parameters<typeof BaseButton>[0]) {
    const [local, others] = splitProps(props, ['key', 'signal', 'classList', 'onClick'])
    const isSelected = createSelector<T>(local.signal)
    return (
        <BaseButton
            classList={{
                ...local.classList,
                [styles.NormalButton]: true,
                [styles.NormalButtonChecked]: isSelected(local.key)
            }}
            onClick={() => {
                local.signal(local.key)
                local.onClick?.()
            }}
            {...others}
        />
    )
}

export default Button
