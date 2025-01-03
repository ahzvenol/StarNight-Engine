import type { Component } from 'solid-js'
import { Show } from 'solid-js'
import jcyt500W from '@/assets/jcyt500W.ttf'
import { Route, router } from '../../router'
import { Graphic } from '../Elements'
import { Game, Title } from '../Pages'
import Back from './Back/Back'
import Config from './Config/Config'
import Gallery from './Gallery/Gallery'
import GameImpl from './Game/Game'
import LandingPage, { isEnter } from './LandingPage/LandingPage'
import SaveLoad from './SaveAndLoad/SaveLoad'
import TitleImpl from './Title/Title'

const UI: Component = () => (
    <Graphic width={1280} height={720} mode="auto">
        <Show when={import.meta.env.DEV === true || isEnter()} fallback={<LandingPage />}>
            <Title>
                <TitleImpl />
            </Title>
            <Game>
                <GameImpl />
            </Game>
            <Route when={(path) => path === 'Config' || path === 'Load' || path === 'Save' || path === 'Gallery'}>
                <div onContextMenu={router.back} style={{ display: 'contents' }}>
                    <Route path="Config">
                        <Config />
                    </Route>
                    <Route path="Load">
                        <SaveLoad mode="Load" />
                    </Route>
                    <Route path="Save">
                        <SaveLoad mode="Save" />
                    </Route>
                    <Route path="Gallery">
                        <Gallery />
                    </Route>
                    <Back onClick={router.back} />
                </div>
            </Route>
        </Show>
        <style jsx global>
            {`
                @font-face {
                    font-family: 'jcyt';
                    src: url(${jcyt500W});
                    font-weight: normal;
                }
                * {
                    position: absolute;
                }
                html {
                    font-family: 'jcyt';
                    font-weight: 500;
                    background-color: black;
                }
                .Page {
                    width: 100%;
                    height: 100%;
                }
            `}
        </style>
    </Graphic>
)

export default UI
