export default {
    R({ n: targetName, x, y, e: transition = '', i: duration }) {
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
            createjs.Tween.get(target).to({ x, y }, duration * 1000, createjs.Ease.quadIn)
        })
    },
}
