import createjs from 'createjs-npm';
import { getResource } from '@/store/preload';
export default {
    async R({ p: backgroundPic, e: transition = '', i: duration = 0, w: wait, x, y }) {
        const container = this.$stage.canvas.getChildByName("background")
        const bitmap = new createjs.Bitmap(getResource(backgroundPic))
        console.log(backgroundPic);
        // tag 临时方案
        if (backgroundPic?.includes('large_')) {
            bitmap.regX = 640
            bitmap.regY = 360
        }
        // if (backgroundPic === 'large_evcg01c.png') {
        //     bitmap.regY = 860
        // }
        //  else if (backgroundPic === 'large_bg040c.png') {
        //     bitmap.regY = 960
        // }
        bitmap.x = x
        bitmap.y = -y
        console.log("x:", bitmap.x, "y:", bitmap.y);
        console.log("regX:", bitmap.regX, "regY:", bitmap.regY);
        container.addChildAt(bitmap, 0);
        // 还是要及时销毁图片,暂时无法控制createjs的行为,使用替代方式
        // tag 原作行为是不是这样还没测试
        createjs.Tween.get(container.getChildAt(1))
            .to({ alpha: 0 }, duration * 1000, createjs.Ease.quadIn)
        // 原作并不在二次点击时清除缓动效果 //读档时需要清除效果
        this.$lifecycle.isInit(() => { this.$setTimeout(() => { container.removeChildAt(1) }, duration * 1000) })

        // fix 包括所有操作$globalArchive的地方都应排除init
        this.$lifecycle.notInit(() => {
            if (!this.$globalArchive.usedCG) {
                this.$globalArchive.usedCG = []
            }
            if (!this.$globalArchive.usedCG.includes(backgroundPic)) this.$globalArchive.usedCG.push(backgroundPic)
        })
        // 依据原脚本的执行顺序编写:效果全程为changeBackground+shake,期间禁止点击
        // fix:所以说现在shake的时候还是可以点啊...
        // shake在changeBackground执行的wait秒后执行
        if (wait) {
            this.viewController.hiddenMessage = true;
            this.clickLock = false;
            this.$setTimeout(() => {
                this.viewController.hiddenMessage = false;
                this.clickLock = true;
            }, (duration + wait) * 1000);
            await this.$sleep(wait);
        }
    },
    F({ p: backgroundPic }) {
        this.$refs.old.style.transitionTimingFunction = '';
        this.$refs.old.style.transitionDuration = '';
        if (this.viewController.picUseFlag) {
            this.$refs.old.style.backgroundImage = `url(${backgroundPic})`;
        } else {
            this.$refs.new.style.backgroundImage = `url(${backgroundPic})`;
        }
    },
}