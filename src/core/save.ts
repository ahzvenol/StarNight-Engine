import type { LocalSaveData } from '@/store/default'
import type { InitialGameData } from './types/Game'
import dayjs from 'dayjs'
import { selectRecord } from './commands/script/selection'
import { textPreview } from './commands/script/textbox'
import { currentStage } from './Core'
import { currentIndex } from './run'

export function getSave(mode: 'simple'): InitialGameData
export function getSave(mode: 'full'): LocalSaveData
export function getSave(mode: 'simple' | 'full') {
    if (mode === 'simple')
        return {
            index: currentIndex(),
            select: selectRecord
        }
    else
        return {
            index: currentIndex(),
            date: dayjs().valueOf(),
            text: textPreview(),
            snapshot: currentStage()!.innerHTML,
            select: selectRecord
        }
}
