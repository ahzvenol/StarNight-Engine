import type { Component } from 'solid-js'
import { useSignal } from 'micro-reactive-solid'
import { Show } from 'solid-js'
import { isDevelopment } from '@/utils/checkEnv'
import { Route, router } from '../../router'
import { Content, Graphic } from '../../utils/ui/Elements'
import Announcement from './Announcement/Announcement'
import Back from './Back/Back'
import Config from './Config/Config'
import Gallery from './Gallery/Gallery'
import Game from './Game/Game'
import Hakuuyosei from './Hakuuyosei/Hakuuyosei'
import { Pages } from './Pages'
import SaveLoad from './SaveAndLoad/SaveLoad'
import Title from './Title/Title'

export const enter = useSignal(false)

const UI: Component = () => (
    <Graphic width={1280} height={720} mode="auto">
        <Show when={isDevelopment() || enter()} fallback={<Announcement enter={() => enter(true)} />}>
            <Route path={Pages.Title}>
                <Title />
            </Route>
            <Route path={Pages.Game}>
                <Game />
            </Route>
            <Route
                when={(path) =>
                    path === Pages.Config ||
                    path === Pages.Load ||
                    path === Pages.Save ||
                    path === Pages.Gallery ||
                    path === Pages.Hakuuyosei
                }>
                <Content onContextMenu={router.back}>
                    <Route path={Pages.Config}>
                        <Config />
                    </Route>
                    <Route path={Pages.Load}>
                        <SaveLoad mode="Load" />
                    </Route>
                    <Route path={Pages.Save}>
                        <SaveLoad mode="Save" />
                    </Route>
                    <Route path={Pages.Gallery}>
                        <Gallery />
                    </Route>
                    <Route path={Pages.Hakuuyosei}>
                        <Hakuuyosei />
                    </Route>
                    <Back onClick={router.back} />
                </Content>
            </Route>
        </Show>
        <style jsx global>
            {`
                @font-face {
                    font-family: 'jcyt';
                    src: url('./static/jcyt500W.ttf');
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
