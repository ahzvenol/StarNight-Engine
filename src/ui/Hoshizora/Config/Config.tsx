import { Component } from 'solid-js'
import { router } from '@/router'
import { useStore } from '@/store/context'
import { resetConfig } from '@/store/store'
import { Button, Clone, Variable } from '@/ui/Elements'
import { BinaryButton, GroupButton } from './Button'
import styles from './Config.module.scss'
import Slider from './Slider'

const Config: Component = () => {
    const config = useStore().config
    return (
        <div class={'Page' + ' ' + styles.Config_container}>
            <div class={styles.Config_cell + ' ' + styles.Config_cell_left} style={{ bottom: `${110 + 75 * 5}px` }}>
                <div class={styles.Config_cell_text}>全屏</div>
                <BinaryButton signal={config.FullScreen} />
            </div>
            <Clone count={3}>
                {(index) => (
                    <Variable
                        value={config[(['InterruptClip', 'FastForwardUnread', 'StopFastOnSelection'] as const)[index]]}>
                        {(item) => (
                            <div
                                class={styles.Config_cell + ' ' + styles.Config_cell_left}
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
            <div class={styles.Config_cell + ' ' + styles.Config_cell_left} style={{ bottom: `185px` }}>
                <div class={styles.Config_cell_text}>窗口透明度</div>
                <Slider signal={config.TextBoxOpacity} />
            </div>
            <Clone count={6}>
                {(index) => (
                    <>
                        <div
                            class={styles.Config_cell + ' ' + styles.Config_cell_right}
                            style={{ bottom: `${110 + 75 * (6 - (index + 1))}px` }}>
                            <div class={styles.Config_cell_text}>
                                {['全体', 'BGM', 'SE', '语音', '正常文字显示速度', '自动阅读速度'][index]}
                            </div>
                            <Slider
                                signal={
                                    [
                                        config.GolbalVolume,
                                        config.BGMVolume,
                                        config.SEVolume,
                                        config.ClipVolume,
                                        config.TextSpeed,
                                        config.AutoReadSpeed
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
