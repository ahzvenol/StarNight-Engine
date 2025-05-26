import type { StarNightInstance } from '@starnight/core'
import { StarNight } from '@starnight/core'
import { useReactive, useSignal } from 'micro-reactive-solid'

StarNight.useReactive = useReactive

export { book } from './../scenario/ScenarioBook'

export const starnight = useSignal<StarNightInstance>(null as unknown as StarNightInstance)
export const ui = () => starnight().context.ui
