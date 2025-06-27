import type { IIconProps } from 'icon-park-solid/src/runtime'
import type { Component } from 'solid-js'
import clsx from 'clsx'
import {
    AlignTextLeftOne,
    DoubleDown,
    DoubleRight,
    DoubleUp,
    FolderOpen,
    Home,
    PlayOne,
    PreviewCloseOne,
    Save,
    SettingTwo
} from 'icon-park-solid'
import { store } from '@/store'
import { starnight } from '@/store/starnight'
import { GUIGameRootState, useGame } from '@/ui/GameRoot'
import { useDialog } from '@/ui/GlobalDialog/GlobalDialog'
import { GUIRootState } from '@/ui/GUIRoot'
import { useSoundEffect } from '../useSoundEffect'
import { translation } from '../translations'
import { showUI } from './Game'
import styles from './ControlPanel.module.scss'

export const ControlPanel: Component = () => {
    const t = translation.gaming.buttons

    const slot = store.local[-1]
    const language = store.config.language

    const fsize = () => (language() === 'fr' ? '125%' : '150%')
    const iconProps = {
        theme: 'outline',
        size: 42,
        fill: '#f5f5f7',
        strokeWidth: 2.5
    } as IIconProps
    return (
        <>
            <div class={styles.Game_ControlPanel_container}>
                <span
                    class={styles.Game_ControlPanel_button}
                    style={{ 'font-size': fsize() }}
                    ref={useSoundEffect('Click', 'Enter')}
                    onClick={() => showUI(false)}
                >
                    <PreviewCloseOne class={styles.Game_ControlPanel_icon} {...iconProps} />
                    <span class={styles.Game_ControlPanel_text}>{t.hide()}</span>
                </span>
                <span
                    class={styles.Game_ControlPanel_button}
                    style={{ 'font-size': fsize() }}
                    ref={useSoundEffect('Click', 'Enter')}
                    onClick={() => GUIGameRootState('Backlog')}
                >
                    <AlignTextLeftOne class={styles.Game_ControlPanel_icon} {...iconProps} />
                    <span class={styles.Game_ControlPanel_text}>{t.backlog()}</span>
                </span>
                {/* <span
                    class={styles.Game_ControlPanel_button}
                    style={{ 'font-size': fsize() }}
                    ref={useSoundEffect('Click', 'Enter')}>
                    <ReplayMusic class={styles.Game_ControlPanel_icon} {...iconProps} />
                    <span class={styles.Game_ControlPanel_text}>{t.replay()}</span>
                </span> */}
                <span
                    class={
                        starnight().state.isAuto()
                            ? styles.Game_ControlPanel_button_active
                            : styles.Game_ControlPanel_button
                    }
                    style={{ 'font-size': fsize() }}
                    ref={useSoundEffect('Click', 'Enter')}
                    onClick={() => starnight().ClickEvents.auto.publish()}
                >
                    <PlayOne class={styles.Game_ControlPanel_icon} {...iconProps} />
                    <span class={styles.Game_ControlPanel_text}>{t.auto()}</span>
                </span>
                <span
                    class={
                        starnight().state.isFast()
                            ? styles.Game_ControlPanel_button_active
                            : styles.Game_ControlPanel_button
                    }
                    style={{ 'font-size': fsize() }}
                    ref={useSoundEffect('Click', 'Enter')}
                    onClick={() => starnight().ClickEvents.fast.publish()}
                >
                    <DoubleRight class={styles.Game_ControlPanel_icon} {...iconProps} />
                    <span class={styles.Game_ControlPanel_text}>{t.forward()}</span>
                </span>
                <span
                    class={clsx(styles.Game_ControlPanel_button)}
                    style={{ 'font-size': fsize() }}
                    ref={useSoundEffect('Click', 'Enter')}
                    onClick={() => slot(starnight().current())}
                >
                    <DoubleDown class={styles.Game_ControlPanel_icon} {...iconProps} />
                    <span class={styles.Game_ControlPanel_text}>{t.quicklySave()}</span>
                    {/* <div class={styles.fastSlPreview + ' ' + styles.fastSPreview}>{fastSlPreview}</div> */}
                </span>
                <span
                    class={clsx(styles.Game_ControlPanel_button)}
                    style={{ 'font-size': fsize() }}
                    ref={useSoundEffect('Click', 'Enter')}
                    onClick={() => {
                        if (slot() !== undefined) useGame(slot()!)
                    }}
                >
                    <DoubleUp class={styles.Game_ControlPanel_icon} {...iconProps} />
                    <span class={styles.Game_ControlPanel_text}>{t.quicklyLoad()}</span>
                    {/* <div class={styles.fastSlPreview + ' ' + styles.fastLPreview}>{fastSlPreview}</div> */}
                </span>
                <span
                    class={styles.Game_ControlPanel_button}
                    style={{ 'font-size': fsize() }}
                    ref={useSoundEffect('Click', 'Enter')}
                    onClick={() => GUIGameRootState('Save')}
                >
                    <Save class={styles.Game_ControlPanel_icon} {...iconProps} />
                    <span class={styles.Game_ControlPanel_text}>{t.save()}</span>
                </span>
                <span
                    class={styles.Game_ControlPanel_button}
                    style={{ 'font-size': fsize() }}
                    ref={useSoundEffect('Click', 'Enter')}
                    onClick={() => GUIGameRootState('Load')}
                >
                    <FolderOpen class={styles.Game_ControlPanel_icon} {...iconProps} />
                    <span class={styles.Game_ControlPanel_text}>{t.load()}</span>
                </span>
                <span
                    class={styles.Game_ControlPanel_button}
                    style={{ 'font-size': fsize() }}
                    ref={useSoundEffect('Click', 'Enter')}
                    onClick={() => GUIGameRootState('Config')}
                >
                    <SettingTwo class={styles.Game_ControlPanel_icon} {...iconProps} />
                    <span class={styles.Game_ControlPanel_text}>{t.options()}</span>
                </span>
                <span
                    class={styles.Game_ControlPanel_button}
                    style={{ 'font-size': fsize() }}
                    ref={useSoundEffect('DialogOpen', 'Enter')}
                    onClick={() => {
                        useDialog({
                            title: t.titleTips(),
                            leftText: translation.common.yes(),
                            rightText: translation.common.no(),
                            leftFunc: () => GUIRootState('Home')
                        })
                    }}
                >
                    <Home class={styles.Game_ControlPanel_icon} {...iconProps} />
                    <span class={styles.Game_ControlPanel_text}>{t.title()}</span>
                </span>
                {/* <span
                    class={styles.Game_ControlPanel_button}
                    style={{ 'font-size': fsize() }}
                    ref={useSoundEffect('Click', 'Enter')}
                    onClick={() => showControlPanel((b) => !b)}>
                    <Show when={showControlPanel()}>
                        <Lock class={styles.Game_ControlPanel_icon} {...iconProps} />
                    </Show>
                    <Show when={!showControlPanel()}>
                        <Unlock class={styles.Game_ControlPanel_icon} {...iconProps} />
                    </Show>
                </span> */}
            </div>
        </>
    )
}
