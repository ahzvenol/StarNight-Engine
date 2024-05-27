import type { Signal } from 'micro-reactive'
import { useReactive } from 'micro-reactive'
import { getUuid } from '../../util'
import type { Container, JsonElement, TElement } from './JsonElement'
import { unZipGenerator } from './JsonElement'

function translate(this: Element, json: JsonElement): void {
    let uuid = "XCO" + getUuid()
    this.id = json.id ? json.id.value : ''
    this.class = `${uuid} ${json.class ? json.class.value : ''}`
    this.style = `.${uuid}{${json.style ? json.style.value : ''}}`
    for (const tag of json.javaScript || []) {
        switch (tag.lifecycle) {
            case "onclick":
                this.onclick = new Function('event', `${tag.value}`).bind(this)
                break
            case "onMount":
                this.onMount = new Function("element", `${tag.value}`).bind(this)
                break
            case "onCleanup":
                this.onCleanup = new Function("element", `${tag.value}`).bind(this)
                break
        }
    }
    const array = json.when?.value
        .flatMap(e => new Function(`return this.varMap['${e.var}']() ${e.operator} ${e.condition}`) as () => boolean)
        .flatMap(f => f.bind(this))
    this.when = array ? () => !array.flatMap(f => f()).includes(false) : this.when
    this.createVar = () => {
        const object = {}
        for (let key in json.createVar?.value || {}) {
            object[key] = useReactive(json.createVar!.value[key])
        }
        return object
    }
    for (const child of json.children || []) this["children"].push(new Element(child))
}

class Element {
    __proto__: any
    id: string = ""
    class: string = ""
    style: string = ""
    children: Array<Element> = []
    onclick: (event: Event) => void = () => { }
    onMount: (element: HTMLDivElement) => void = () => { }
    onCleanup: (element: HTMLDivElement) => void = () => { }
    when: () => boolean = () => true
    createVar: () => ObjectMap<Signal<any>> = () => ({})
    constructor(json: TElement | Container | JsonElement) {
        if ((json as any).type !== undefined) translate.bind(this)(unZipGenerator(json as TElement | Container))
        else translate.bind(this)(json)
    }
}


export default Element