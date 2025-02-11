import type { Component } from 'solid-js'
import clsx from 'clsx'
import { createEffect, Match, Switch } from 'solid-js'
import { translation } from '@/store/effects/translations'
import { Button, Clone } from '@/ui/Elements'
import { log } from '@/utils/logger'
import { useSignal } from '@/utils/solid/useSignal'
import styles from './Config.module.scss'
import Display from './Display/Display'
import Sound from './Sound/Sound'
import System from './System/System'

enum Page {
    'System' = 'System',
    'Display' = 'Display',
    'Sound' = 'Sound'
}

const Config: Component = () => {
    const currentPage = useSignal(Page.System)
    const t = translation.menu.options

    createEffect(() => log.info(`Config:当前页面 ${currentPage()}`))
    return (
        <div class={styles.Options_main}>
            <div class={styles.Options_top}>
                <div class={styles.Options_title}>
                    <div class={styles.Option_title_text}>{t.title()}</div>
                </div>
            </div>
            <div class={styles.Options_page_container}>
                <div class={styles.Options_button_list}>
                    <Clone count={3}>
                        {(i) => (
                            <Button
                                class={clsx(styles.Options_page_button, {
                                    [styles.Options_page_button_active]:
                                        currentPage() === [Page.System, Page.Display, Page.Sound][i]
                                })}
                                onClick={() => currentPage([Page.System, Page.Display, Page.Sound][i])}>
                                {t.pages[(['system', 'display', 'sound'] as const)[i]].title()}
                            </Button>
                        )}
                    </Clone>
                </div>
                <div class={styles.Options_main_content}>
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
    )
}

export default Config
