import { Context } from '@/store/context'
import { Store } from '@/store/default'
import { Component } from 'solid-js'
import { Route, router } from '../../router'
import { Graphic } from '../Elements'
// import Config from './Config/Config'
// import Gallery from './Gallery/Gallery'
import SaveLoad from './SaveAndLoad/SaveLoad'
import Title from './Title/Title'
import Game from '@/core/Game'
import Back from './Back/Back'
import jcyt500W from '@/assets/jcyt500W.ttf'

const UI: Component<{ environment: Store }> = ({ environment }) => (
    <Context environment={environment}>
        <Graphic config={environment.system}>
            <Route path="">
                <Title />
            </Route>
            <Route path="Game">
                <Game />
            </Route>
            <Route when={(path) => path === 'Config' || path === 'Load' || path === 'Save' || path === 'Gallery'}>
                <div onContextMenu={router.back} style={{ width: '100%', height: '100%' }}>
                    <Route path="Config">{/* <Config></Config> */}</Route>
                    <Route path="Load">
                        <SaveLoad mode="Load" />
                    </Route>
                    <Route path="Save">
                        <SaveLoad mode="Save" />
                    </Route>
                    <Route path="Gallery">{/* <Gallery></Gallery> */}</Route>
                    <Back />
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
                `}
            </style>
        </Graphic>
    </Context>
)

export default UI
