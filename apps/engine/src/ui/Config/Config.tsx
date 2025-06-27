import type { Component } from 'solid-js'
import clsx from 'clsx'
import { useSignal } from 'micro-reactive-solid'
import { Match, Switch } from 'solid-js'
import { Clone } from '@/utils/ui/Elements'
import { translation } from '../translations'
import { useSoundEffect } from '../useSoundEffect'
import styles from './Config.module.scss'
import { Display } from './Display/Display'
import { Sound } from './Sound/Sound'
import { System } from './System/System'

enum Page {
    System = 'System',
    Display = 'Display',
    Sound = 'Sound'
}

export const Config: Component = () => {
    const t = translation.menu.options

    const currentPage = useSignal(Page.System)
    return (
        <>
            <div class={styles.Config_main}>
                <div class={styles.Config_top}>
                    <div class={styles.Config_title}>
                        <div class={styles.Config_title_text}>{t.title()}</div>
                    </div>
                </div>
                <div class={styles.Config_page_container}>
                    <div class={styles.Config_button_list}>
                        <Clone count={3}>
                            {(i) => (
                                <div
                                    ref={useSoundEffect('Switch', 'Enter')}
                                    class={clsx(styles.Config_page_button, {
                                        [styles.Config_page_button_active]:
                                            currentPage() === [Page.System, Page.Display, Page.Sound][i]
                                    })}
                                    onClick={() => currentPage([Page.System, Page.Display, Page.Sound][i])}
                                >
                                    {t.pages[(['system', 'display', 'sound'] as const)[i]].title()}
                                </div>
                            )}
                        </Clone>
                    </div>
                    <div class={styles.Config_main_content}>
                        <Switch>
                            <Match when={currentPage() === Page.System}>
                                <System />
                            </Match>
                            <Match when={currentPage() === Page.Display}>
                                <Display />
                            </Match>
                            <Match when={currentPage() === Page.Sound}>
                                <Sound />
                            </Match>
                        </Switch>
                    </div>
                </div>
            </div>
        </>
    )
}
