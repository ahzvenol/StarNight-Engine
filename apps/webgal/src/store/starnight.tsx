import type { StarNightInstance } from '@starnight/core'
import { StarNight } from '@starnight/core'
import { useReactive, useSignal } from 'micro-reactive-solid'
import { Scenario } from '@/core/ScenarioBook'
// @ts-expect-error 文件不是模块。
import index from 'scenario/index.scenario'

StarNight.useReactive = useReactive

export const starnight = useSignal<StarNightInstance>(null as unknown as StarNightInstance)
export const ui = () => starnight().context.ui
export const scenario = () => Scenario(index)
