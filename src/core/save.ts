import type { LocalSaveData } from '@/store/default'
import dayjs from 'dayjs'
import { currentIndex } from './act'
import { textPreview } from './commands/script/textbox'

export const getSave: Function0<LocalSaveData> = () => ({
    index: currentIndex(),
    date: dayjs().valueOf(),
    text: textPreview()
})
