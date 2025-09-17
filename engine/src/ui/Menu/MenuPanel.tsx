import type { Signal } from 'micro-reactive-solid'
import type { GUIGameRootPages } from '../GameRoot'
import type { GUIHomeRootPages } from '../HomeRoot'
import clsx from 'clsx'
import { FolderOpen, Home, Logout, Save, SettingTwo } from 'icon-park-solid'
import { GUIGameRootState } from '../GameRoot'
import { useDialog } from '../GlobalDialog/GlobalDialog'
import { GUIRootState } from '../GUIRoot'
import { GUIHomeRootState } from '../HomeRoot'
import { translation } from '../translations'
import { useSoundEffect } from '../useSoundEffect'
import styles from './MenuPanel.module.scss'

export const MenuPanel = () => {
    const t = translation.menu

    const GUIState: Signal<GUIHomeRootPages | GUIGameRootPages> =
        GUIRootState() === 'Home' ? GUIHomeRootState : GUIGameRootState
    return (
        <div class={styles.MenuPanel_main}>
            <div
                ref={useSoundEffect('PageChange')}
                class={clsx(styles.MenuPanel_button, { [styles.MenuPanel_button_active]: GUIState() === 'Save' })}
                onClick={() => {
                    if (GUIRootState() === 'Game') GUIState('Save')
                }}
                style={{
                    color: GUIState() === 'Save' ? `rgba(74, 34, 93, 0.9)` : `rgba(123,144,169,1)`
                }}
            >
                <Save
                    class={styles.MenuPanel_button_icon}
                    theme="outline"
                    size="1.2em"
                    fill={GUIState() === 'Save' ? `rgba(74, 34, 93, 0.9)` : `rgba(123,144,169,1)`}
                    strokeWidth={2}
                />
                {t.saving.title()}
            </div>
            <div
                ref={useSoundEffect('PageChange')}
                class={clsx(styles.MenuPanel_button, { [styles.MenuPanel_button_active]: GUIState() === 'Load' })}
                onClick={() => GUIState('Load')}
                style={{
                    color: GUIState() === 'Load' ? `rgba(11, 52, 110, 0.9)` : `rgba(123,144,169,1)`
                }}
            >
                <FolderOpen
                    class={styles.MenuPanel_button_icon}
                    theme="outline"
                    size="1.2em"
                    fill={GUIState() === 'Load' ? `rgba(11, 52, 110, 0.9)` : `rgba(123,144,169,1)`}
                    strokeWidth={2}
                />
                {t.loadSaving.title()}
            </div>
            <div
                ref={useSoundEffect('DialogOpen')}
                class={styles.MenuPanel_button}
                onClick={() =>
                    useDialog({
                        title: translation.gaming.buttons.titleTips(),
                        leftText: translation.common.yes(),
                        rightText: translation.common.no(),
                        leftFunc: () => {
                            GUIRootState('Home')
                            GUIHomeRootState('Title')
                        }
                    })}
                style={{ color: 'rgba(123,144,169,1)' }}
            >
                <Home
                    class={styles.MenuPanel_button_icon}
                    theme="outline"
                    size="1.2em"
                    fill="rgba(123,144,169,1)"
                    strokeWidth={2}
                />
                {t.title.title()}
            </div>
            <div
                ref={useSoundEffect('PageChange')}
                class={clsx(styles.MenuPanel_button, {
                    [styles.MenuPanel_button_active]: GUIState() === 'Config'
                })}
                onClick={() => GUIState('Config')}
                style={{
                    'margin-left': 'auto',
                    color: GUIState() === 'Config' ? `rgba(81, 110, 65, 0.9)` : `rgba(123,144,169,1)`
                }}
            >
                <SettingTwo
                    class={styles.MenuPanel_button_icon}
                    theme="outline"
                    size="1.2em"
                    fill={GUIState() === 'Config' ? `rgba(81, 110, 65, 0.9)` : `rgba(123,144,169,1)`}
                    strokeWidth={2}
                />
                {t.options.title()}
            </div>
            <div
                ref={useSoundEffect('Click')}
                class={styles.MenuPanel_button}
                onClick={() => {
                    if (GUIRootState() === 'Home') {
                        GUIState('Title')
                    } else if (GUIRootState() === 'Game') {
                        GUIState('Game')
                    }
                }}
                style={{ color: 'rgba(123,144,169,1)' }}
            >
                <Logout
                    class={styles.MenuPanel_button_icon}
                    theme="outline"
                    size="1.2em"
                    fill="rgba(123,144,169,1)"
                    strokeWidth={2}
                />
                {t.exit.title()}
            </div>
        </div>
    )
}
