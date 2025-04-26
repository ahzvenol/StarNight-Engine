import click_se from '@/assets/click.mp3'
import dialog_se from '@/assets/dialog.mp3'
import mouse_enter from '@/assets/mouse-enter.mp3'
import page_flip_1 from '@/assets/page-flip-1.mp3'
import switch_1 from '@/assets/switch-1.mp3'
import { useEventListener } from '@/utils/solid/useEventListener'
import { UISE } from '../store/audio'

const SEEnter = UISE({ src: mouse_enter })
const SEClick = UISE({ src: click_se })
const SESwitch = UISE({ src: switch_1 })
const SEPageChange = UISE({ src: page_flip_1 })
const SEDialogOpen = UISE({ src: dialog_se })

type Effect = 'Enter' | 'Click' | 'Switch' | 'PageChange' | 'DialogOpen'

export const useSoundEffect =
    (...args: Array<Effect>) =>
    (ref: HTMLElement) => {
        const set = new Set(args)
        if (set.has('Enter')) {
            useEventListener('mouseenter', () => SEEnter.play(), { target: ref })
        }
        if (set.has('Click')) {
            useEventListener('click', () => SEClick.play(), { target: ref })
        }
        if (set.has('Switch')) {
            useEventListener('click', () => SESwitch.play(), { target: ref })
        }
        if (set.has('PageChange')) {
            useEventListener('click', () => SEPageChange.play(), { target: ref })
        }
        if (set.has('DialogOpen')) {
            useEventListener('click', () => SEDialogOpen.play(), { target: ref })
        }
    }
