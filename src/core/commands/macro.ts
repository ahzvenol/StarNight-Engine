import { MacroEntity } from '../types/Marco'
import { audio } from './hoshizora/audio'
import { setImage } from './hoshizora/image'
import { say } from './hoshizora/say'
import { video } from './hoshizora/video'

export const macros = [
    MacroEntity.from('image', setImage),
    MacroEntity.from('say', say),
    MacroEntity.from('audio', audio),
    MacroEntity.from('video', video)
] as const
