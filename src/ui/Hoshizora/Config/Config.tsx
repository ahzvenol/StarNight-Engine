import type { Component } from 'solid-js'
import clsx from 'clsx'
import { router } from '@/router'
import { useStore } from '@/store/context'
import { resetConfig } from '@/store/store'
import { Button, Clone, Variable } from '@/ui/Elements'
import { log } from '@/utils/logger'
import { BinaryButton, GroupButton } from './Button'
import styles from './Config.module.scss'
import Slider from './Slider'

const Config: Component = () => {
    log.info('Config组件函数被调用')
    const config = useStore().config
    return (
        <div class={clsx('Page', styles.Config_container)}>
            <div class={clsx(styles.Config_cell, styles.Config_cell_left)} style={{ bottom: `${110 + 75 * 5}px` }}>
                <div class={styles.Config_cell_text}>全屏</div>
                <BinaryButton signal={config.fullscreen} />
            </div>
            <Clone count={3}>
                {(index) => (
                    <Variable
                        value={config[(['interruptclip', 'fastforwardunread', 'stopfastonselection'] as const)[index]]}>
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
                                        config.golbalvolume,
                                        config.bgmvolume,
                                        config.sevolume,
                                        config.clipvolume,
                                        config.textspeed,
                                        config.autoreadspeed
                                    ][index]
                                }
                            />
                        </div>
                    </>
                )}
            </Clone>
            <Button class={styles.Config_bottom_back_title} onClick={() => router.navigate('')} />
            {/* 原作hover效果在点击后移除 */}
            <Button class={styles.Config_bottom_reset} onClick={resetConfig} />
        </div>
    )
}

export default Config
