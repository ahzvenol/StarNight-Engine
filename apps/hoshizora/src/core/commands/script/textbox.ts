import { SwitchState } from 'starnight'
import { useActScopeSignal } from 'starnight'
import { ActScope, Dynamic, NonBlocking } from 'starnight'
import { wait } from './wait'

declare module 'starnight' {
    interface GameLocalData {
        textpreview?: string
    }
}

export const textpreview = ActScope(
    NonBlocking<{ text: string }>(({ current }) => ({ text }) => {
        current.textpreview(text)
    })
)

export const UIIconState = useActScopeSignal(SwitchState.Disabled)

export const icon = ActScope(
    NonBlocking(() => () => {
        UIIconState(SwitchState.Enabled)
    })
)

declare module 'starnight' {
    interface GameConfig {
        textspeed: number
    }
}

export const UIText = useActScopeSignal('')
export const text = ActScope(
    Dynamic<{ text: string }>(
        (context) =>
            function* ({ text }) {
                while (text.length >= 1) {
                    yield wait.apply(context)({
                        duration: 100 - context.config.textspeed() * 100
                    })
                    UIText((i) => i + text.charAt(0))
                    text = text.slice(1)
                }
            }
    )
)

export const UIName = useActScopeSignal('')

export const name = ActScope(
    NonBlocking<{ name: string }>(() => ({ name }) => {
        UIName(name)
    })
)

export const UITextboxState = useActScopeSignal<SwitchState>(SwitchState.Enabled)

export const textbox = NonBlocking<{ enable: boolean }>(() => ({ enable }) => {
    if (enable) UITextboxState(SwitchState.Enabled)
    else UITextboxState(SwitchState.Disabled)
})
