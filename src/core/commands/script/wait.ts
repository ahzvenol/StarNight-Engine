import { Dynamic } from '../../command'
import { _wait } from './abstract/wait'

export const wait = Dynamic<{ duration: number }>(
    ({ timer }) =>
        function* ({ duration }) {
            yield _wait(timer)(duration)
        }
)
