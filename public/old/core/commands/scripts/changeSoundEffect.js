
export default {
    R({ a: soundEffect = '', l: loop = false, i: duration = 0 }){
        this.$bus.se.src = soundEffect;
        this.$bus.se.loop = loop;
        // todo:缓出效果
    },
}