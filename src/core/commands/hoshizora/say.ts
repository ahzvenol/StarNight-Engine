import { CommandRunFunction } from '@/core/Command'
import { Backlog } from '../script/backlog'
import { Name, Text } from '../script/textbox'
import { Audio } from '../script/audio'
import { par } from '@/core/Flow'

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
                if (file !== undefined) return Audio(context)({ target: 'Clip', file })
            },
            () => Backlog(context)({ text, name, file })
        ])()
    }

export const Say = say
