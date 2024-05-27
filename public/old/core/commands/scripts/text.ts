export default {
    // todo:需完善
    async R({ t, x, y, w, h }: { t: string, x: number, y: number, w: number, h: number }) {
        // 手动泄漏所需变量到eval
        // 重复代码
        let evalVarStr = ""
        for (const key in this.args) {
            evalVarStr += `let ${key} = ${JSON.stringify(this.args[key])};`
        }
        // 展示文本框到对应位置并用eval显示文本
    },
}
