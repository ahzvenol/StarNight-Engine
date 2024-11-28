import type { MacroFunction } from '@/core/types/Marco'
import type { SayCommandArgs } from '../macro/say'
import { say as _say } from '../macro/say'

export const say: MacroFunction<SayCommandArgs> = ({ text, name, file }) => {
    return _say({ text, name, file: file ? `./static/AudioClip/${file}.wav` : undefined })
}
