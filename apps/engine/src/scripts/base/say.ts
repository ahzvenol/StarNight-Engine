import type { Reactive } from '@starnight/core'
import { ActScope, Dynamic, NonBlocking, StarNight } from '@starnight/core'
import { gsap } from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { isString } from 'es-toolkit'
import { Tween } from './index'

gsap.registerPlugin(SplitText)

declare module '@starnight/core' {
    interface GameConfig {
        textspeed: number
    }
    interface GameLocalData {
        text: string
    }
    interface GameUIInternalData {
        text: HTMLElement
    }
}

StarNight.GameEvents.setup.subscribe(({ current, ui }) => {
    current.text('')
    ui.text = document.createElement('div')
})

StarNight.ActEvents.start.subscribe(({ state, current, ui }) => {
    if (!state.isInitializing()) {
        current.text('')
        ui.text.innerHTML = ''
    }
})

const compareElementOrder = (a: Node, b: Node) =>
    a.compareDocumentPosition(b) & 2 ? 1 : a.compareDocumentPosition(b) & 4 ? -1 : 0

export const text = ActScope(
    Dynamic<string | HTMLElement | HTMLElement[]>(
        (context) =>
            function* (arg0) {
                const { current, config, ui } = context
                const element = document.createElement('div')
                element.append(...(Array.isArray(arg0)
                    ? arg0
                    : isString(arg0)
                        ? arg0.split('\n').flatMap((line, index, arr) =>
                                index === arr.length - 1 ? [line] : [line, document.createElement('br')]
                            )
                        : [arg0])
                )
                ui.text.append(element)
                current.text((prev) => prev + element.outerHTML)
                const rubys = element.querySelectorAll('ruby')
                const split = SplitText.create(ui.text,
                    { type: 'chars', reduceWhiteSpace: false, ignore: rubys, aria: 'hidden' }
                )
                const nodes = split.chars.concat(Array.from(rubys)).sort(compareElementOrder)
                const speed = config.textspeed()
                yield Tween.apply({
                    target: nodes, id: ui.text, mode: 'from', opacity: 0,
                    duration: nodes.length * speed, ease: 'sine.out', stagger: speed / 1000
                })(context)
            }
    )
)

declare module '@starnight/core' {
    interface GameLocalData {
        name: string
    }
    interface GameUIInternalData {
        name: Reactive<string>
    }
}

StarNight.GameEvents.setup.subscribe(({ current, ui }) => {
    current().name = ''
    ui.name = current.name
})

export const name = ActScope(
    NonBlocking<string>((context) => (arg0) => {
        context.current.name(arg0)
    })
)
