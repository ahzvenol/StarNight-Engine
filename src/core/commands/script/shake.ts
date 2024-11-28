import anime from 'animejs'
import { State } from '@/core/types/Game'
import { ActScope, Dynamic } from '../../flow'
import { stageView } from './image'

export type ShakePunchCommandArgs = { target: string; x?: number; y?: number; duration: number; iteration?: number }

// 因为image命令使用translate参数,这里使用left和top避免冲突

export const shake = Dynamic<ShakePunchCommandArgs>(
    ActScope(
        ({ state }) =>
            function* ({ target, x = 0, y = 0, duration, iteration = 5 }) {
                if (state === State.Fast) return
                const realTarget = stageView()!.getElementsByClassName(target)[0]
                const originX = 0
                const originY = 0
                const sequence = anime.timeline({
                    targets: realTarget,
                    easing: 'linear'
                })
                const dur = duration / 2 / iteration
                for (let i = 0; i < iteration; i++) {
                    const nextX = originX + (Math.random() * x * 2 - x)
                    const nextY = originY + (Math.random() * y * 2 - y)
                    sequence.add({ left: nextX, top: nextY, duration: dur, direction: 'alternate' })
                }
                sequence.add({ left: originX, top: originY, duration: dur, direction: 'alternate' })
                yield sequence.finished
            }
    )
)

export const punch = Dynamic<ShakePunchCommandArgs>(
    ActScope(
        ({ state }) =>
            function* ({ target, x = 0, y = 0, duration, iteration = 5 }) {
                if (state === State.Init || state === State.Fast) return
                const realTarget = stageView()!.getElementsByClassName(target)[0]
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
