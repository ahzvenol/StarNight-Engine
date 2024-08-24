import { useReactive } from 'micro-reactive'
import { Button, Clone } from '../Elements'
import { translation } from '../translations'
import styles from './config.module.scss'
import { Component, Match, Switch, createEffect } from 'solid-js'
import Menu from '../Menu'
import logger from '@/utils/Logger'
import System from './System'

enum Page {
  'System',
  'Display',
  'Sound',
}

export const Config: Component = () => {
  const currentPage = useReactive(Page.System)
  const t = translation.menu.options
  createEffect(() => logger.info(`Config-当前页面:${currentPage()}`))
  return (
    <Menu>
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
                  { // @ts-ignore
                    t.pages[['system', 'display', 'sound'][i]].title()
                  }
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
                <></>
              </Match>
              <Match when={currentPage() === Page.Sound}>
                <></>
              </Match>
            </Switch>
          </div>
        </div>
      </div>
    </Menu>
  )
}

export default Config