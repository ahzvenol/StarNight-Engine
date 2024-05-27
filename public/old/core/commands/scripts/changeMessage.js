function log(text, audioClipSrc) {
    let obj = {};
    // if (this.viewController.hiddenName === false)//这个判断的作用是?
    obj.name = this.nameView || undefined;
    obj.message = text;
    // 这里的判断实际上更复杂
    obj.src = audioClipSrc || '';
    this.log.push(obj);
    // 不能挂等号,因为最后一次判断为true之后还会push一次
    if (this.log.length > 50) {
        this.log.splice(0, 1);
    }
}
import { numberListToString, stringToNumberList } from '../../../util'

export default {
    R({ t: text = "", n: name = "mono", a: audioClipSrc = "" }) {
        // 播放音频:目前策略,还原原作,幕数更改会中断上一幕音频播放
        // tag?:应该不存在不含changeMessage命令的幕吧?// 最好还是再修修
        // if (audioClip) {
        this.$bus.audioClip.src = audioClipSrc;
        this.$bus.audioClip.play()
        // 同样,向下加载音频
        // this.prepareNextThirdAudio(this.rowIndex)
        // }

        // todo 使用集合表示法
        //读档时不应记录index
        this.$lifecycle.notInit(() => {
            let watchedIndexList = stringToNumberList(this.$globalArchive.watchedIndex)
            if (watchedIndexList.includes(this.rowIndex)) {
                this.$refs.text.style.color = "#94c6ec";
            } else {
                this.$refs.text.style.color = "white";
                watchedIndexList.push(this.rowIndex);
                this.$globalArchive.watchedIndex = numberListToString(watchedIndexList)
            }
        })
        this.textTemp = text;
        // 控制name元素的显示与隐藏,没文字大概也不会有名字,所以干脆放一起
        // 如果名字不是空,那重新显示名字,如果是空,保持上一次的状态
        // issue:是不是这个mono也没用?---好像是个旧版本印象来着---这样会导致mono不能作为name
        this.nameView = name == "mono" ? this.nameView : name;
        // 以下执行text区域操作
        //#region
        this.textView = "";
        let x = 0;
        // fix 万一没文字....// test:这个应该修好了吧
        for (let i of text) {
            x++;
            this.$setTimeout(() => {
                this.textView += i;
                // 文字显示速度在0-100毫秒之间
            }, x * this.$config.showTextSpeed * 100);
        }
        // 最后通过v-show显示star
        //#endregion
        if (text) {
            log.call(this, text, audioClipSrc);
        }
    },
    F({ t: text = "", n: name = "mono", a: audioClipSrc = "" }) {
        // fix:这里如果赋值会产生无用请求,不赋值不行---可能需要一个temp单元
        // 考虑从log中抽取
        this.isFastOrInit(() => {
            if (parseInt(localStorage.getItem("lastIndex")) >= this.rowIndex) {
                this.$refs.text.style.color = "#94c6ec";
            } else {
                this.$refs.text.style.color = "white";
                localStorage.setItem("lastIndex", this.rowIndex);
            }
        })
        this.textTemp = this.textView = text;
        this.nameView = name == "mono" ? this.nameView : name;
        this.isFastOrInit(() => {
            if (text) {
                log.call(this, text, audioClipSrc);
            }
        })
    },
};