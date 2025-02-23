import type { Component } from 'solid-js'
import { useStore } from '@/store/context'
import { translation } from '@/store/effects/translations'
import { Clone, Variable } from '@/ui/Elements'
import { useSignal } from '@/utils/solid/useSignal'
import Button from '../Button'
import Cell from '../Cell'
import styles from '../Config.module.scss'
import Slider from '../Slider'

const Sound: Component = () => {
    const t = translation.menu.options.pages.sound.options

    const config = useStore().config
    return (
        <div class={styles.Options_main_content_half}>
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
                <Variable value={useSignal(0)}>
                    {(val) => (
                        <Clone count={2}>
                            {(i) => (
                                // todo:变量绑定
                                <Button key={i} signal={val} onClick={noop}>
                                    {t[(['voiceStop', 'voiceContinue'] as const)[i]].title()}
                                </Button>
                            )}
                        </Clone>
                    )}
                </Variable>
            </Cell>
        </div>
    )
}

export default Sound
