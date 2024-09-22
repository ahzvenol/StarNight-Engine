import { Context } from '@/store/context'
import { Store } from '@/store/default'
import { Component } from 'solid-js'
import { Route, router } from '../../router'
import Config from './Config/Config'
import { Graphic } from '../Elements'
import Gallery from './Gallery/Gallery'
import Dialog from './GlobalDialog/GlobalDialog'
import Menu from './Menu/Menu'
import SaveLoad from './SaveAndLoad/SaveLoad'
import Title from './Title/Title'
import Game from '@/core/Game'
import SourceHanSerifCN_Regular from '@/assets/SourceHanSerifCN-Regular.ttf'
import LXGWWenKai_Regular from '@/assets/LXGWWenKai-Regular.ttf'
import OPPOSans_R from '@/assets/OPPOSans-R.ttf'

// todo:最后让AI去整理import的值和type吧
const UI: Component<{ environment: Store }> = ({ environment }) => (
    <Context environment={environment}>
        <Graphic config={environment.system}>
            <Dialog />
            <Route path="">
                <Title />
            </Route>
            <Route path="Game">
                <Game />
            </Route>
            <div onContextMenu={router.back}>
                <Route when={(path) => path === 'Config' || path === 'Load' || path === 'Save'}>
                    <Menu>
                        <Route path="Config">
                            <Config />
                        </Route>
                        <Route path="Load">
                            <SaveLoad mode="Load" />
                        </Route>
                        <Route path="Save">
                            <SaveLoad mode="Save" />
                        </Route>
                    </Menu>
                </Route>
                <Route path="Gallery">
                    <Gallery />
                </Route>
            </div>
            <style jsx global>
                {`
                    @font-face {
                        font-family: '思源宋体';
                        src: url(${SourceHanSerifCN_Regular}) format('truetype');
                    }
                    @font-face {
                        font-family: 'LXGW';
                        src: url(${LXGWWenKai_Regular}) format('truetype');
                    }
                    @font-face {
                        font-family: 'WebgalUI';
                        src: url(${OPPOSans_R}) format('truetype');
                    }
                    * {
                        box-sizing: border-box;
                    }
                    #root {
                        font-size: 160%;
                        overflow: hidden;
                        text-rendering: optimizeSpeed;
                        -webkit-font-smoothing: antialiased;
                        line-height: 1.5;
                    }
                `}
            </style>
        </Graphic>
    </Context>
)

export default UI
