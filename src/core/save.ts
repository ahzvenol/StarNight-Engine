import type { LocalSaveData } from '@/store/default'
import dayjs from 'dayjs'
import { textPreview } from './commands/script/textbox'
import { currentIndex } from './run'

export const getSave: Function0<LocalSaveData> = () => ({
    index: currentIndex(),
    date: dayjs().valueOf(),
    text: textPreview()
})
