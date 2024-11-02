import type { CommandRunFunction } from '@/core/type'
import { par } from '@/core/flow'
import { Audio } from '../script/audio'
import { Backlog } from '../script/backlog'
import { Name, Text } from '../script/textbox'

type SayCommandArgs = { text: string; name?: string; file?: string }

const say: CommandRunFunction<SayCommandArgs> =
    (context) =>
    ({ text, name, file: rawfile }) => {
        const file = rawfile ? `./static/AudioClip/${rawfile}.wav` : undefined
        return par([
            () => Text(context)({ text }),
            () => {
                if (name !== undefined) return Name(context)({ name })
            },
            () => {
                if (file !== undefined) return Audio(context)({ name: 'Clip', file })
            },
            () => Backlog(context)({ text, name, file })
        ])()
    }

export const Say = say
