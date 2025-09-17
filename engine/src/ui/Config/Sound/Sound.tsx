import type { Component } from 'solid-js'
import { Clone } from '@/utils/ui/Elements'
import { store } from '@/store'
import { translation } from '../../translations'
import { Button } from '../Button'
import { Cell } from '../Cell'
import styles from '../Config.module.scss'
import { Slider } from '../Slider'

export const Sound: Component = () => {
    const t = translation.menu.options.pages.sound.options

    const config = store.config
    return (
        <div class={styles.Config_main_content_half}>
            <Cell title={t.volumeMain.title}>
                <Slider signal={config.globalvolume} />
            </Cell>
            <Cell title={t.vocalVolume.title}>
                <Slider signal={config.clipvolume} />
            </Cell>
            <Cell title={t.bgmVolume.title}>
                <Slider signal={config.bgmvolume} />
            </Cell>
            <Cell title={t.seVolume.title}>
                <Slider signal={config.sevolume} />
            </Cell>
            <Cell title={t.uiSeVolume.title}>
                <Slider signal={config.uisevolume} />
            </Cell>
            <Cell title={t.voiceOption.title}>
                <Clone count={2}>
                    {(i) => (
                        <Button key={[true, false][i]} signal={config.interruptclip}>
                            {t[(['voiceStop', 'voiceContinue'] as const)[i]].title()}
                        </Button>
                    )}
                </Clone>
            </Cell>
        </div>
    )
}
