import type { StarNightInstance } from '@starnight/core'
import { StarNight } from '@starnight/core'
import { useReactive, useSignal } from 'micro-reactive-solid'
import type { GameScenarioDSL } from '@/core/ScenarioBook'
import { Scenario } from '@/core/ScenarioBook'

StarNight.useReactive = useReactive

export const starnight = useSignal<StarNightInstance>(null as unknown as StarNightInstance)
export const ui = () => starnight().context.ui
export const scenario = import('./scenario').then((mod) => mod.default)
export const script = async () => Scenario(await scenario as GameScenarioDSL)
