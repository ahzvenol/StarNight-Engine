import type { Component } from 'solid-js'
import { translation } from '@/store/effect/translations'
import { Clone, Variable } from '@/ui/Elements'
import { useSignal } from '@/utils/Reactive'
import Button from '../Button'
import Cell from '../Cell'
import styles from '../Config.module.scss'
import Slider from '../Slider'

const Display: Component = () => {
    const t = translation.menu.options.pages.display.options
    return (
        <div class={styles.Options_main_content_half}>
            <Cell title={t.fullScreen.title}>
                <Variable value={useSignal(0)}>
                    {(val) => (
                        <Clone count={2}>
                            {(i) => (
                                // todo:变量绑定
                                <Button key={i} signal={val} onClick={() => {}}>
                                    {t.fullScreen.options[(['on', 'off'] as const)[i]]()}
                                </Button>
                            )}
                        </Clone>
                    )}
                </Variable>
            </Cell>
            <Cell title={t.textSpeed.title}>
                <Variable value={useSignal(0)}>
                    {(val) => (
                        <Clone count={3}>
                            {(i) => (
                                // todo:变量绑定
                                <Button key={i} signal={val} onClick={() => {}}>
                                    {t.textSpeed.options[(['slow', 'medium', 'fast'] as const)[i]]()}
                                </Button>
                            )}
                        </Clone>
                    )}
                </Variable>
            </Cell>
            <Cell title={t.textSize.title}>
                <Variable value={useSignal(0)}>
                    {(val) => (
                        <Clone count={3}>
                            {(i) => (
                                // todo:变量绑定
                                <Button key={i} signal={val} onClick={() => {}}>
                                    {t.textSize.options[(['small', 'medium', 'large'] as const)[i]]()}
                                </Button>
                            )}
                        </Clone>
                    )}
                </Variable>
            </Cell>
            <Cell title={t.textFont.title}>
                <Variable value={useSignal(0)}>
                    {(val) => (
                        <Clone count={3}>
                            {(i) => (
                                // todo:变量绑定
                                <Button key={i} signal={val} onClick={() => {}}>
                                    {t.textFont.options[(['siYuanSimSun', 'SimHei', 'lxgw'] as const)[i]]()}
                                </Button>
                            )}
                        </Clone>
                    )}
                </Variable>
            </Cell>
            <Cell title={t.textboxOpacity.title}>
                <Slider signal={useSignal(1)} />
            </Cell>
            {/* <Cell title={t.textPreview.title}> */}
            {/* 这是一个临时的组件，用于模拟文本预览的效果 */}
            {/* <TextPreview /> */}
            {/* </Cell> */}
        </div>
    )
}

export default Display
