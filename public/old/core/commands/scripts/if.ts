export default {
    // todo:需完善
    // c: condition, t: then, e: else
    async R({ c, t, e }: { c: string, t: ObjectMap, e: ObjectMap }) {
        // 手动泄漏所需变量到eval
        let evalVarStr = ""
        for (const key in this.args) {
            evalVarStr += `let ${key} = ${JSON.stringify(this.args[key])};`
        }
        if ((0, eval)(evalVarStr + c)) if (t) await this.commands[t['@']](t)
        else if (e) await this.commands[e['@']](e)
    },
}
