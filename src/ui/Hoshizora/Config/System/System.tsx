import { clearSave, clearStorage, resetConfig } from '@/store/store'
import { useStore } from '@/store/context'
import { description, language, translation } from '@/translations'
import { Clone, Variable } from '@/ui/Elements'
import { useDialog } from '@/ui/GlobalDialog/GlobalDialog'
import { useSignal } from '@/utils/Reactive'
import { Component, For } from 'solid-js'
import Button from '../Button'
import Cell from '../Cell'
import styles from '../config.module.scss'

const System: Component = () => {
    const t = translation.menu.options.pages.system.options
    const showAbout = useSignal(false)

    const config = useStore().config
    return (
        <div class={styles.Options_main_content_half}>
            {/* {showAbout && <About onClose={toggleAbout} />} */}
            <Cell title={t.autoSpeed.title}>
                <Variable value={useSignal(0)}>
                    {(val) => (
                        <Clone count={3}>
                            {(i) => (
                                // todo:变量绑定
                                <Button key={i} signal={val} onClick={() => {}}>
                                    {t.autoSpeed.options[(['slow', 'medium', 'fast'] as const)[i]]()}
                                </Button>
                            )}
                        </Clone>
                    )}
                </Variable>
            </Cell>
            <Cell title={t.language.title}>
                <Variable value={useSignal(config.language())}>
                    {(val) => (
                        <For each={Object.keys(language) as (keyof typeof language)[]}>
                            {(key) => (
                                <Button key={key} signal={val} onClick={() => config.language(key)}>
                                    {description[key]}
                                </Button>
                            )}
                        </For>
                    )}
                </Variable>
            </Cell>
            <Cell title={t.resetData.title}>
                <Variable value={() => -1}>
                    {(val) => (
                        <Clone count={3}>
                            {(i) => (
                                <Button
                                    key={0}
                                    signal={val}
                                    onClick={() =>
                                        useDialog({
                                            title: t.resetData.dialogs[
                                                (['clearGameSave', 'resetSettings', 'clearAll'] as const)[i]
                                            ](),
                                            leftText: translation.common.yes,
                                            rightText: translation.common.no,
                                            leftFunc: [clearSave, resetConfig, clearStorage][i]
                                        })
                                    }>
                                    {t.resetData.options[
                                        (['clearGameSave', 'resetSettings', 'clearAll'] as const)[i]
                                    ]()}
                                </Button>
                            )}
                        </Clone>
                    )}
                </Variable>
            </Cell>
            <Cell title={t.gameSave.title}>
                <Variable value={() => -1}>
                    {(val) => (
                        <Clone count={2}>
                            {(i) => (
                                <Button key={0} signal={val} onClick={[clearSave, resetConfig, clearStorage][i]}>
                                    {t.gameSave.options[(['export', 'import'] as const)[i]]()}
                                </Button>
                            )}
                        </Clone>
                    )}
                </Variable>
            </Cell>
            <div class={styles.About_title_text} onClick={() => showAbout(!showAbout())}>
                <span class={styles.About_text}>{t.about.title}</span>
            </div>
        </div>
    )
}

export default System
