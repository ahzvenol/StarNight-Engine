import type { Component } from 'solid-js'
import { useSignal } from 'micro-reactive-solid'
import { onCleanup, onMount, Show } from 'solid-js'
import { Content } from '@/utils/ui/Elements'
import { Gallery } from '@/ui/Gallery/Gallery'
import { suppress } from '@/utils/solid/suppress'
import { BGM } from '../store/audio'
import { Config } from './Config/Config'
import { Menu } from './Menu/Menu'
import { SaveLoad } from './SaveAndLoad/SaveLoad'
import { Title } from './Title/Title'

export type GUIHomeRootPages = 'Title' | 'Config' | 'Save' | 'Load' | 'Gallery'

export const GUIHomeRootState = useSignal<GUIHomeRootPages>('Title')

const audio = BGM({ loop: true, src: './static/AudioClip/bgm01.flac' })

export const HomeRoot: Component = () => {
    GUIHomeRootState('Title')

    onMount(() => audio.play())
    onCleanup(() => audio.stop())
    return (
        <>
            <Title />
            <Content ref={suppress('contextmenu')} onContextMenu={() => GUIHomeRootState('Title')}>
                <Show when={['Config', 'Save', 'Load'].includes(GUIHomeRootState())}>
                    <Menu>
                        <Show when={GUIHomeRootState() === 'Config'}>
                            <Config />
                        </Show>
                        <Show when={GUIHomeRootState() === 'Save'}>
                            <SaveLoad mode="Save" />
                        </Show>
                        <Show when={GUIHomeRootState() === 'Load'}>
                            <SaveLoad mode="Load" />
                        </Show>
                    </Menu>
                </Show>
                <Show when={GUIHomeRootState() === 'Gallery'}>
                    <Gallery />
                </Show>
            </Content>
        </>
    )
}
