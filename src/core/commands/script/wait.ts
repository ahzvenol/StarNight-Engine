import { Dynamic } from '../../command'
import { _wait } from './abstract/wait'

export const wait = Dynamic<{ duration: number }>(
    (context) =>
        function* ({ duration }) {
            yield* _wait(context)(duration)
        }
)
