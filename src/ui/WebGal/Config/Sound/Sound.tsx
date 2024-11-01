import type { Component } from 'solid-js'
import { useStore } from '@/store/context'
import { translation } from '@/store/effect/translations'
import { Clone, Variable } from '@/ui/Elements'
import { useSignal } from '@/utils/Reactive'
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
                <Slider signal={config.GolbalVolume} />
            </Cell>
            <Cell title={t.vocalVolume.title}>
                <Slider signal={config.ClipVolume} />
            </Cell>
            <Cell title={t.bgmVolume.title}>
                <Slider signal={config.BGMVolume} />
            </Cell>
            <Cell title={t.seVolume.title}>
                <Slider signal={config.SEVolume} />
            </Cell>
            <Cell title={t.uiSeVolume.title}>
                <Slider signal={config.UISEVolume} />
            </Cell>
            <Cell title={t.voiceOption.title}>
                <Variable value={useSignal(0)}>
                    {(val) => (
                        <Clone count={2}>
                            {(i) => (
                                // todo:变量绑定
                                <Button key={i} signal={val} onClick={() => {}}>
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
