import type { Reactive } from '@starnight/core'
import { ActScope, Dynamic, NonBlocking, StarNight } from '@starnight/core'
import { gsap } from 'gsap'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(SplitText)

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

const compareElementOrder = (a: Node, b: Node) => (a.compareDocumentPosition(b) & 2 ? 1 : a.compareDocumentPosition(b) & 4 ? -1 : 0)

export const text = ActScope(
    Dynamic<string | HTMLElement>(
        ({ current, config, ui }) =>
            function* (arg0) {
                const container = document.createElement('div')
                container.append(arg0)
                ui.text.append(container)
                current.text(ui.text.innerHTML)
                const rubys = container.querySelectorAll('ruby')
                const split = SplitText.create(ui.text, { type: 'chars', aria: 'hidden', smartWrap: true })
                const nodes = split.chars.concat(Array.from(rubys)).sort(compareElementOrder)
                const speed = config.textspeed() / 1000
                const timeline = gsap.from(nodes, { opacity: 0, duration: nodes.length * speed, ease: 'sine.out', stagger: speed })
                yield new Promise((res) => timeline.eventCallback('onComplete', res))
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
