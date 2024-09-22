import { router } from '@/router'
import { translation } from '@/translations'
import { Button } from '@/ui/Elements'
import { FolderOpen, Home, Logout, Save, Setting } from './MenuIcon'
import styles from './MenuPanel.module.scss'
import { useDialog } from '@/ui/GlobalDialog/GlobalDialog'

/**
 * Menu页的底栏
 * @constructor
 */
export const MenuPanel = () => {
    const t = translation.menu

    return (
        <div class={styles.MenuPanel_main}>
            <Button
                class={styles.MenuPanel_button}
                classList={{ [styles.MenuPanel_button_hl]: router.active() === 'Save' }}
                onClick={() => router.navigate('Save', true)}
                style={{
                    color: router.active() === 'Save' ? `rgba(74, 34, 93, 0.9)` : `rgba(123,144,169,1)`
                }}>
                <div class={styles.MenuPanel_button_icon}>
                    <Save fill={router.active() === 'Save' ? `rgba(74, 34, 93, 0.9)` : `rgba(123,144,169,1)`} />
                </div>
                {t.saving.title()}
            </Button>
            <Button
                class={styles.MenuPanel_button}
                classList={{ [styles.MenuPanel_button_hl]: router.active() === 'Load' }}
                onClick={() => router.navigate('Load', true)}
                style={{
                    color: router.active() === 'Load' ? `rgba(11, 52, 110, 0.9)` : `rgba(123,144,169,1)`
                }}>
                <div class={styles.MenuPanel_button_icon}>
                    <FolderOpen fill={router.active() === 'Load' ? `rgba(11, 52, 110, 0.9)` : `rgba(123,144,169,1)`} />
                </div>
                {t.loadSaving.title()}
            </Button>
            <Button
                class={styles.MenuPanel_button}
                onClick={() =>
                    useDialog({
                        title: translation.gaming.buttons.titleTips,
                        leftText: translation.common.yes,
                        rightText: translation.common.no,
                        leftFunc: () => router.navigate('')
                    })
                }
                style={{ color: 'rgba(123,144,169,1)' }}>
                <div class={styles.MenuPanel_button_icon}>
                    <Home fill={'rgba(123,144,169,1)'} />
                </div>
                {t.title.title()}
            </Button>
            <Button
                class={styles.MenuPanel_button}
                classList={{ [styles.MenuPanel_button_hl]: router.active() === 'Config' }}
                onClick={() => router.navigate('Config', true)}
                style={{
                    'margin-left': 'auto',
                    color: router.active() === 'Config' ? `rgba(81, 110, 65, 0.9)` : `rgba(123,144,169,1)`
                }}>
                <div class={styles.MenuPanel_button_icon}>
                    <Setting fill={router.active() === 'Config' ? `rgba(81, 110, 65, 0.9)` : `rgba(123,144,169,1)`} />
                </div>
                {t.loadSaving.title()}
            </Button>
            <Button class={styles.MenuPanel_button} onClick={router.back} style={{ color: 'rgba(123,144,169,1)' }}>
                <div class={styles.MenuPanel_button_icon}>
                    <Logout />
                </div>
                {t.exit.title()}
            </Button>
        </div>
    )
}
