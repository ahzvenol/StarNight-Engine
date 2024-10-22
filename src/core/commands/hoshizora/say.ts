import { CommandRunFunction, State } from '@/core/Command'
import { Backlog } from '../script/backlog'
import { Name, Text } from '../script/textbox'
import { Audio } from '../script/audio'
import { par } from '@/core/macro'

type SayCommandArgs = { text: string; name?: string; file?: string }

const say: CommandRunFunction<SayCommandArgs> =
    (context) =>
    ({ text, name, file: rawfile }) => {
        const file = rawfile ? `./static/AudioClip/${rawfile}.wav` : undefined
        if (context.state === State.Init) {
            if (file !== undefined) Audio.init(context)({ target: 'Clip', file })
        } else {
            return par([
                () => Text.run(context)({ text }),
                () => {
                    if (name !== undefined) Name.run(context)({ name })
                },
                () => {
                    if (file !== undefined) Audio.run(context)({ target: 'Clip', file })
                },
                () => Backlog.run(context)({ text, name, file })
            ])()
        }
    }

export const Say = { init: say, run: say }
