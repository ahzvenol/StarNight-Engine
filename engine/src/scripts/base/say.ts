import type { Reactive } from '@starnight/core'
import { ActScope, Dynamic, NonBlocking, StarNight } from '@starnight/core'
import { gsap } from 'gsap'
import { SplitText } from '@/lib/SplitText'

gsap.registerPlugin(SplitText)

declare module '@starnight/core' {
    interface GameConfig {
        textspeed: number
    }
    interface GameLocalData {
        text: string
    }
    interface GameUIInternalData {
        text: Reactive<HTMLElement | null>
    }
}

StarNight.GameEvents.setup.subscribe(({ current, ui }) => {
    current.text('')
    ui.text = StarNight.useReactive(null)
})

StarNight.ActEvents.start.subscribe(({ state, current, ui }) => {
    if (!state.isInitializing()) {
        current.text('')
        ui.text(null)
    }
})

const compareElementOrder = (a: Node, b: Node) =>
    a.compareDocumentPosition(b) & 2 ? 1 : a.compareDocumentPosition(b) & 4 ? -1 : 0

export const text = ActScope(
    Dynamic<string>(
        ({ current, config, ui, temp: { activetimelines } }) =>
            function* (arg0) {
                const element = document.createElement('div')
                element.innerHTML = arg0
                ui.text((i) => i || document.createElement('div')).append(element)
                current.text((prev) => prev + element.outerHTML)
                const rubys = element.querySelectorAll('ruby')
                const split = SplitText.create(ui.text()!,
                    { type: 'chars', reduceWhiteSpace: false, ignore: rubys, aria: 'hidden' }
                )
                const nodes = split.chars.concat(Array.from(rubys)).sort(compareElementOrder)
                const speed = config.textspeed() / 1000
                const timeline = activetimelines.get(ui.text()!)
                    || activetimelines.set(ui.text()!, gsap.timeline()).get(ui.text()!)!
                timeline.from(nodes, { duration: nodes.length * speed, ease: 'sine.out', stagger: speed, opacity: 0 })
                const currentDuration = timeline.duration()
                yield new Promise((resolve) => timeline.once('complete', resolve))
                if (currentDuration === timeline.duration()) timeline.progress(1)
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
