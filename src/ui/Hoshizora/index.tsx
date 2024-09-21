import { Context } from '@/store/context'
import { Store } from '@/store/default'
import { Component } from 'solid-js'
import { Route, router } from '../../router'
import Config from './Config/Config'
import { Graphic } from '../Elements'
import Gallery from './Gallery/Gallery'
import SaveLoad from './SaveAndLoad/SaveLoad'
import Title from './Title/Title'
import Game from '@/core/Game'

const UI: Component<{ environment: Store }> = ({ environment }) => (
    <Context environment={environment}>
        <Graphic config={environment.system}>
            <Route path="">
                <Title></Title>
            </Route>
            <Route path="Game">
                <Game></Game>
            </Route>
            <div onContextMenu={router.back}>
                <Route when={(path) => path === 'Config' || path === 'Load' || path === 'Save'}>
                    <Route path="Config">
                        <Config></Config>
                    </Route>
                    <Route path="Load">
                        <SaveLoad mode="Load"></SaveLoad>
                    </Route>
                    <Route path="Save">
                        <SaveLoad mode="Save"></SaveLoad>
                    </Route>
                </Route>
                <Route path="Gallery">
                    <Gallery></Gallery>
                </Route>
            </div>
            <style jsx global>
                {`
                    @font-face {
                        font-family: 'jcyt';
                        src: url('assets/jcyt500W.ttf');
                        font-weight: normal;
                    }
                `}
            </style>
        </Graphic>
    </Context>
)

export default UI
