import anime from 'animejs'
import { isUndefined } from 'es-toolkit'
import { Dynamic, EffectScope } from '../../decorator'
import { UIStage } from './image'

// 目前,这里索引到hoshizora的stageView

export type ShakePunchCommandArgs = { target?: string; x?: number; y?: number; duration: number; iteration?: number }

// 因为image命令使用translate参数,这里使用left和top避免冲突

export const shake = EffectScope(
    Dynamic<ShakePunchCommandArgs>(
        () =>
            function* ({ target, x = 0, y = 0, duration, iteration = 10 }) {
                const realTarget = isUndefined(target) ? UIStage() : UIStage().querySelector(`[data-name="${target}"]`)
                const originX = 0
                const originY = 0
                const sequence = anime.timeline({
                    targets: realTarget,
                    easing: 'linear'
                })
                const dur = duration / 2 / iteration
                for (let i = 0; i < iteration; i++) {
                    const percentage = i / iteration
                    const diminishing = 1 - percentage
                    const nextX = originX + Math.random() * (x * diminishing * 2) - x * diminishing
                    const nextY = originY + Math.random() * (y * diminishing * 2) - y * diminishing
                    sequence.add({ left: nextX, top: nextY, duration: dur, direction: 'alternate' })
                }
                sequence.add({ left: originX, top: originY, duration: dur, direction: 'alternate' })
                yield sequence.finished
            }
    )
)

export const punch = EffectScope(
    Dynamic<ShakePunchCommandArgs>(
        () =>
            function* ({ target, x = 0, y = 0, duration, iteration = 5 }) {
                const realTarget = isUndefined(target) ? UIStage() : UIStage().querySelector(`[data-name="${target}"]`)
                const originX = 0
                const originY = 0
                const sequence = anime.timeline({
                    targets: realTarget,
                    easing: 'linear'
                })
                const dur = duration / 2 / iteration
                for (let i = 0; i < iteration; i++) {
                    const coef = i % 2 === 0 ? 1 : -1
                    const nextX = originX + (coef * x) / (i + 1)
                    const nextY = originY + (coef * y) / (i + 1)
                    sequence.add({ left: nextX, top: nextY, duration: dur, direction: 'alternate' })
                }
                sequence.add({ left: originX, top: originY, duration: dur, direction: 'alternate' })
                yield sequence.finished
            }
    )
)
