import type { Component } from 'solid-js'
import bgm01 from '@/assets/bgm01.wav'
import jcyt500W from '@/assets/jcyt500W.ttf'
import { Route, router } from '../../router'
import { Game, Title } from '../Pages'
import Back from './Back/Back'
import Config from './Config/Config'
import Gallery from './Gallery/Gallery'
import GameImpl from './Game/Game'
import SaveLoad from './SaveAndLoad/SaveLoad'
import TitleImpl from './Title/Title'

const UI: Component = () => (
    <>
        <Title bgm={bgm01}>
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
    </>
)

export default UI
