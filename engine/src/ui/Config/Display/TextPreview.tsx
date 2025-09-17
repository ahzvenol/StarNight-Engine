import type { Component } from 'solid-js'
import { SplitText } from 'gsap/SplitText'
import { gsap } from 'gsap'
import { TextBox } from '@/ui/Game/TextBox'
import { store } from '@/store'
import { translation } from '@/ui/translations'
import styles from './TextPreview.module.scss'

export const TextPreview: Component = () => {
    const speed = store.config.textspeed() / 1000
    const element = (<div>{translation.menu.options.pages.display.options.textPreview.text()}</div>) as HTMLElement
    const split = SplitText.create(element, { type: 'chars', reduceWhiteSpace: false, aria: 'hidden' })
    gsap.from(split.chars, { opacity: 0, duration: split.chars.length * speed, ease: 'sine.out', stagger: speed })
    return (
        <div class={styles.Config_TextPreview}>
            <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                <TextBox text={element} name={() => '文本显示预览'} />
            </div>
        </div>
    )
}
