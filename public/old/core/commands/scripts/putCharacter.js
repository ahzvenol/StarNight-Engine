import { getResource } from '@/store/preload';
export default {
    R({ n: characterName, p: characterSrc, x, y, i: duration = 0, e: transition = '' }) {
        // const "bitmap" is read-only
        // 考虑使用层
        // let bitmap = this.$stage.canvas.getChildByName(characterName)
        // if (!bitmap) {
        //     bitmap = new createjs.Bitmap(getResource(characterSrc))
        //     bitmap.name = characterName
        //     this.$stage.canvas.addChild(bitmap)
        //     bitmap.x = x
        //     bitmap.y = y
        // } else {
        //     bitmap.image = undefined
        //     bitmap = new createjs.Bitmap(getResource(characterSrc))
        //     bitmap.name = characterName
        //     this.$stage.canvas.addChild(bitmap)
        //     createjs.Tween.get(bitmap)
        //         .to({ alpha: 0, x, y }, duration * 1000, createjs.Ease.quadIn)
        // }
        // let container = this.$stage.canvas.getChildByName(characterName)
        if (characterName.endsWith('l')) {
            this.$stage.canvas.removeChild(this.$stage.canvas.getChildByName(characterName.substr(0, characterName.length - 1)))
            x -= 110
            y -= 148.5
        } else {
            this.$stage.canvas.removeChild(this.$stage.canvas.getChildByName(characterName + 'l'))
            x += 190
            // y += -77.5 + 400
            y += -77.5
        }
        // console.log(x, y);
        console.log(characterName);
        let container = this.$stage.canvas.getChildByName(characterName)
        if (!container) {
            container = new createjs.Container()
            container.name = characterName
            this.$stage.canvas.addChild(container);
        }
        let bitmap = new createjs.Bitmap(getResource(characterSrc))
        container.addChildAt(bitmap, 0);
        if (container.getChildAt(1)) {
            container.removeChild(container.getChildAt(1))
        }
        container.x = x
        container.y = y
        // console.log(container);
    }
}