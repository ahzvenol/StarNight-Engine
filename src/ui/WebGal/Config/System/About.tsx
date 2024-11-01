import { Left } from '@icon-park/react'
import { __INFO } from '@/config/info'
import useTrans from '@/hooks/useTrans'
import s from './about.module.scss'

export default function About(props: { onClose: () => void }) {
    const t = useTrans('menu.options.pages.system.options.about.')
    return (
        <div class={s.about}>
            <div class={s.backButton} onClick={props.onClose}>
                <Left class={s.icon} theme="outline" size="35" strokeWidth={3} fill="#333" />
            </div>
            <div class={s.title}>{t('subTitle')}</div>
            <div class={s.title}>{t('version')}</div>
            <div class={s.text}>{__INFO.version}</div>
            <div class={s.title}>{t('source')}</div>
            <div class={s.text}>
                <a target="_blank" href="https://github.com/OpenWebGAL/WebGAL">
                    https://github.com/OpenWebGAL/WebGAL
                </a>
            </div>
            <div class={s.title}>{t('contributors')}</div>
            <div class={s.text}>
                <a target="_blank" href="https://github.com/OpenWebGAL/WebGAL/graphs/contributors">
                    https://github.com/OpenWebGAL/WebGAL/graphs/contributors
                </a>
            </div>
            <div class={s.title}>{t('website')}</div>
            <div class={s.text}>
                <a target="_blank" href="https://openwebgal.com/">
                    https://openwebgal.com/
                </a>
            </div>
        </div>
    )
}
