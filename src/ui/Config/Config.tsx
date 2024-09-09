import logger from '@/utils/Logger'
import { useReactive } from 'micro-reactive'
import { Component, Match, Switch, createEffect } from 'solid-js'
import { translation } from '../../translations'
import { Button, Clone } from '../Elements'
import Menu from '../Menu/Menu'
import Sound from './Sound/Sound'
import System from './System/System'
import styles from './config.module.scss'
import Display from './Display/Display'

enum Page {
  'System' = 'System',
  'Display' = 'Display',
  'Sound' = 'Sound',
}

const Config: Component = () => {
  const currentPage = useReactive(Page.System)
  const t = translation.menu.options

  createEffect(() => logger.info(`Config:当前页面 ${currentPage()}`))
  return (
      <div class={styles.Options_main}>
        <div class={styles.Options_top}>
          <div class={styles.Options_title}>
            <div class={styles.Option_title_text}>{t.title()}</div>
          </div>
        </div>
        <div class={styles.Options_page_container}>
          <div class={styles.Options_button_list}>
            <Clone count={3}>{
              (i) =>
                <Button
                  classList={{
                    [styles.Options_page_button]: true,
                    [styles.Options_page_button_active]: currentPage() === [Page.System, Page.Display, Page.Sound][i]
                  }}
                  onclick={() => currentPage([Page.System, Page.Display, Page.Sound][i])}
                >
                  {t.pages[(['system', 'display', 'sound'] as const)[i]].title()}
                </Button>
            }
            </Clone>
          </div>
          <div class={styles.Options_main_content}>
            <Switch>
              <Match when={currentPage() === Page.System}>
                <System></System>
              </Match>
              <Match when={currentPage() === Page.Display}>
                <Display></Display>
              </Match>
              <Match when={currentPage() === Page.Sound}>
                <Sound></Sound>
              </Match>
            </Switch>
          </div>
        </div>
      </div>
  )
}

export default Config