// tag:临时性方案
let role = [
    'noir',
    'noirl',
    'karuha',
    'karuhal',
    'neri',
    'neril',
    'jibie',
    'jibiel',
    'hanae',
    'hanael',
    'takase',
    'takasel',
    'mashiro',
    'mashirol'
]
export default {
    // tag:好像可以合并命令
    R({ n: characterName }) {
        if (characterName === '') {
            role.forEach(n => this.$stage.canvas.removeChild(this.$stage.canvas.getChildByName(n)))
        } else {
            this.$stage.canvas.removeChild(this.$stage.canvas.getChildByName(characterName))
        }
    }
}