import type { GameSence } from '@/scenario/type'

declare module '*.scenario' {
    const $: GameSence<void>
    export default $
}
declare module '*.scenario.js' {
    const $: GameSence<void>
    export default $
}
declare module '*.scenario.jsx' {
    const $: GameSence<void>
    export default $
}
declare module '*.scenario.ts' {
    const $: GameSence<void>
    export default $
}
declare module '*.scenario.tsx' {
    const $: GameSence<void>
    export default $
}
