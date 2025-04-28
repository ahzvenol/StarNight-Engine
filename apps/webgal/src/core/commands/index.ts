import { achievement } from './script/achievement'
import { closeaudio, fadeaudio, setaudio } from './script/audio'
import { backlog } from './script/backlog'
import { addchoice, showchoices } from './script/choice'
import { check, click } from './script/click'
import { closeimage, setimage, tweenimage } from './script/gasp-pixi'
import { icon, name, namepreview, text, textbox, textpreview } from './script/textbox'
import { unlock } from './script/unlock'
import { video } from './script/video'

export const commands = {
    achievement,
    setimage,
    tweenimage,
    closeimage,
    setaudio,
    fadeaudio,
    closeaudio,
    addchoice,
    showchoices,
    name,
    text,
    icon,
    backlog,
    textpreview,
    namepreview,
    video,
    unlock,
    click,
    check,
    textbox
} as const
