import type { Signal } from 'micro-reactive-solid'
import type { Component } from 'solid-js'
import clsx from 'clsx'
import { router } from '@/router'
import { useStore } from '@/store/context'
import { CustomDefaultStore } from '@/store/custom'
import { Clone, Variable } from '@/ui/Elements'
import { log } from '@/utils/logger'
import { Button } from '../Button'
import { BinaryButton, GroupButton } from './Button'
import styles from './Config.module.scss'
import Slider from './Slider'

const Config: Component = () => {
    log.info('Config组件函数被调用')
    const store = useStore()
    const config = store.config

    return (
        <div class={clsx('Page', styles.Config_container)}>
            <div class={clsx(styles.Config_cell, styles.Config_cell_left)} style={{ bottom: `${110 + 75 * 5}px` }}>
                <div class={styles.Config_cell_text}>全屏</div>
                <BinaryButton signal={config.fullscreen} />
            </div>
            <Clone count={3}>
                {(index) => (
                    <Variable
                        value={config[(['interruptclip', 'fastforwardunread', 'stopfastonchoice'] as const)[index]]}>
                        {(item) => (
                            <div
                                class={clsx(styles.Config_cell, styles.Config_cell_left)}
                                style={{ bottom: `${110 + 75 * (4 - (index + 1) + 1)}px` }}>
                                <div class={styles.Config_cell_text}>
                                    {['单击停止语音播放', '快进未读文本', '在选项处解除快进'][index]}
                                </div>
                                <GroupButton signal={item} />
                            </div>
                        )}
                    </Variable>
                )}
            </Clone>
            <div class={clsx(styles.Config_cell, styles.Config_cell_left)} style={{ bottom: `185px` }}>
                <div class={styles.Config_cell_text}>窗口透明度</div>
                <Slider signal={config.textboxopacity} />
            </div>
            <Clone count={6}>
                {(index) => (
                    <>
                        <div
                            class={clsx(styles.Config_cell, styles.Config_cell_right)}
                            style={{ bottom: `${110 + 75 * (6 - (index + 1))}px` }}>
                            <div class={styles.Config_cell_text}>
                                {['全体', 'BGM', 'SE', '语音', '正常文字显示速度', '自动阅读速度'][index]}
                            </div>
                            <Slider
                                signal={
                                    [
                                        config.globalvolume,
                                        config.bgmvolume,
                                        config.sevolume,
                                        config.clipvolume,
                                        ((value) => {
                                            if (value === undefined) return 1 - config.textspeed(value) / 100
                                            else
                                                return value instanceof Function
                                                    ? config.autoreadspeed(
                                                          100 - (value(1 - config.textspeed(value)) / 100) * 100
                                                      )
                                                    : config.textspeed(100 - value * 100)
                                        }) as Signal<number>,
                                        ((value) => {
                                            if (value === undefined) return 1 - config.autoreadspeed(value) / 2000
                                            else
                                                return value instanceof Function
                                                    ? config.autoreadspeed(
                                                          2000 - (value(1 - config.autoreadspeed(value)) / 2000) * 2000
                                                      )
                                                    : config.autoreadspeed(2000 - value * 2000)
                                        }) as Signal<number>
                                    ][index]
                                }
                            />
                        </div>
                    </>
                )}
            </Clone>
            <Button class={styles.Config_bottom_back_title} onClick={() => router.navigate('')} />
            {/* 原作hover效果在点击后移除 */}
            <Button
                class={styles.Config_bottom_reset}
                onClick={async () => config((await CustomDefaultStore()).config)}
            />
        </div>
    )
}

export default Config
