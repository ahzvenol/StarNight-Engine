import click_se from '@/assets/click.mp3'
import dialog_se from '@/assets/dialog.mp3'
import mouse_enter from '@/assets/mouse-enter.mp3'
import page_flip_1 from '@/assets/page-flip-1.mp3'
import switch_1 from '@/assets/switch-1.mp3'
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
                ref.addEventListener('mouseenter', () => SEEnter.play())
            }
            if (set.has('Click')) {
                ref.addEventListener('click', () => SEClick.play())
            }
            if (set.has('Switch')) {
                ref.addEventListener('click', () => SESwitch.play())
            }
            if (set.has('PageChange')) {
                ref.addEventListener('click', () => SEPageChange.play())
            }
            if (set.has('DialogOpen')) {
                ref.addEventListener('click', () => SEDialogOpen.play())
            }
        }
