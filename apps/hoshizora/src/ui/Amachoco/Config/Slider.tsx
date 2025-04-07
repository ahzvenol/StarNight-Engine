import type { Reactive } from 'micro-reactive-solid'
import type { Component } from 'solid-js'
import BaseSlider from '@/ui/Slider'
import styles from './Slider.module.scss'

const Slider: Component<{ signal: Reactive<number> }> = ({ signal }) => (
    <div class={styles.Config_Slider_background}>
        <BaseSlider
            track={<div class={styles.Config_Slider_track} />}
            fill={<div class={styles.Config_Slider_fill} />}
            thumb={<div class={styles.Config_Slider_thumb} />}
            signal={signal}
        />
    </div>
)

export default Slider
