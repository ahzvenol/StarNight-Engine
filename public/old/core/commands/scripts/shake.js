// import shakePunch from '@/utils/shakePunch';

export default {
    R({ n: targetName, x = 0, y = 0, e: transition = '', i: duration }) {
        this.$lifecycle.notInit(() => {
            let target;
            switch (targetName) {
                case 'Graphics':
                    target = this.$stage.canvas
                    break
                case 'BG':
                    target = this.$stage.canvas.getChildByName("background")
                    break
                default:
                    target = this.$stage.canvas.getChildByName(targetName)
            }
            // tag:函数不存在
            shakePunch.call(this, target, transition, duration, x, y)
        })
    },
}