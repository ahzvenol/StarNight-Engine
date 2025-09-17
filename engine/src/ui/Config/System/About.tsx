import type { Component } from 'solid-js'
import { Left } from 'icon-park-solid'
import { store } from '@/store'
import { translation } from '@/ui/translations'
import styles from './about.module.scss'

export const About: Component<{ close: () => void }> = ({ close }) => {
    const system = store.system
    return (
        <div class={styles.About_container}>
            <div class={styles.About_Button_back} onClick={close}>
                <Left class={styles.About_icon} theme="outline" size="35" strokeWidth={3} fill="#333333" />
            </div>
            {/* <div class={styles.About_title}>{t('subTitle')}</div> */}
            <div class={styles.About_title}>{translation.menu.options.pages.system.options.about.version()}</div>
            <div class={styles.About_text}>{system.versionname()}</div>
            {/* <div class={styles.About_title}>{t('source')}</div>
            <div class={styles.About_text}>
                <a target="_blank" href="https://github.com/OpenWebGAL/WebGAL">
                    https://github.com/OpenWebGAL/WebGAL
                </a>
            </div>
            <div class={styles.About_title}>{t('contributors')}</div>
            <div class={styles.About_text}>
                <a target="_blank" href="https://github.com/OpenWebGAL/WebGAL/graphs/contributors">
                    https://github.com/OpenWebGAL/WebGAL/graphs/contributors
                </a>
            </div>
            <div class={styles.About_title}>{t('website')}</div>
            <div class={styles.About_text}>
                <a target="_blank" href="https://openwebgal.com/">
                    https://openwebgal.com/
                </a>
            </div> */}
        </div>
    )
}
