import '@/lib/live2dcubismcore.min.js'
import '@/lib/live2d.min.js'
import type { ImageTargetStageChildren } from './impl'
import { NonBlocking } from '@starnight/core'
import { isString } from 'es-toolkit'
import { logger, SoundManager } from '@/lib/pixi-live2d'
import { LazyLive2DModel } from './utils/LazyLive2DModel'

export type Live2DCommandArgs = { target: ImageTargetStageChildren, motion: string, expression?: string }

const Live2DCubism2 = import('@/lib/live2d.min.js')
const Live2DCubism4 = import('@/lib/live2dcubismcore.min.js')
Live2DCubism2.catch(() => logger.warn('Could not find Cubism 2 runtime.'))
Live2DCubism4.catch(() => logger.warn('Could not find Cubism 4 runtime.'))
Promise.all([Live2DCubism2, Live2DCubism4])

SoundManager.volume = 0

export const live2d = NonBlocking<Live2DCommandArgs>(
    ({ current, local: { iclearpoint }, temp: { stage } }) =>
        async ({ target: _target, motion, expression }) => {
            if (isString(_target) && iclearpoint && current.count() < iclearpoint) return
            const target = stage.getChildByName(_target)?.getChildAt(-1).internal
            if (target instanceof LazyLive2DModel) target.motion(motion, 0, 3, { expression })
        }
)
