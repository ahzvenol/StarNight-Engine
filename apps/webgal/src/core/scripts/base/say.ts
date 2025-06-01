import type { Reactive } from '@starnight/core'
import { ActScope, Dynamic, NonBlocking, StarNight } from '@starnight/core'
import { System } from '.'

declare module '@starnight/core' {
    interface GameUIInternalData {
        textend: Reactive<boolean>
    }
}

StarNight.GameEvents.setup.subscribe(({ ui }) => {
    ui.textend = StarNight.useReactive(false)
})

StarNight.ActEvents.start.subscribe(({ ui }) => {
    ui.textend(false)
})

export const end = ActScope(
    NonBlocking(({ ui: { textend } }) => () => {
        textend(true)
    })
)

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

StarNight.ActEvents.start.subscribe(({ current, ui }) => {
    current.text('')
    ui.text.innerHTML = ''
})

function f(node: HTMLElement, speed: number, timeline: gsap.core.Timeline) {
    for (const child of node.children) {
        if (child.nodeType === Node.TEXT_NODE) {
            const text = node.textContent!
            const frag = document.createDocumentFragment()
            for (const char of text) {
                const span = document.createElement('span')
                span.textContent = char
                frag.appendChild(span)
                timeline.fromTo(span, { opacity: 0 }, { opacity: 1, duration: speed })
            }
            child.parentNode!.replaceChild(frag, node)
        } else if (child instanceof HTMLElement) {
            f(child, speed, timeline)
        }
    }
}

export const text = ActScope(
    Dynamic<string | HTMLElement>(
        (context) =>
            function* (arg0) {
                const nodes = arg0 instanceof HTMLElement ? [...arg0.childNodes] : [arg0]
                context.current.text(arg0 instanceof HTMLElement ? arg0.outerHTML : arg0)
                context.ui.text.append(nodes.shift()!)
                console.log(context.config.textspeed(), nodes)
                while (nodes.length >= 1) {
                    yield System.wait(context.config.textspeed())(context)
                    context.ui.text.append(nodes.shift()!)
                }
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
