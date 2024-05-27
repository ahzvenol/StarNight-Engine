// import { accurateSetInterval } from '../../../util';

export default {
    R({ a: backgroundMusic, i: duration = 0 }) {
        this.$bus.backgroundAudio.src = backgroundMusic;
        // todo 缓入缓出效果

        let percent = Math.round(this.$config.bgmVolume / duration / 60 * 1000) / 1000
        this.$lifecycle.notInit(() => {
            let update
            // fix:关于重复的src问题...
            this.$bus.backgroundAudio.src = backgroundMusic;
            if (backgroundMusic) {
                this.$bus.backgroundAudio.volume = 0

                update = function update() {
                    this.$bus.backgroundAudio.volume += percent
                }
            } else {
                this.$bus.backgroundAudio.volume = this.$config.bgmVolume

                update = function update() {
                    this.$bus.backgroundAudio.volume -= percent
                }
            }
            // tag:不受状态管理
            // tag:函数不存在
            accurateSetInterval(duration, 60, update, () => { this.$bus.backgroundAudio.volume = this.$config.bgmVolume })
        })
    },
}