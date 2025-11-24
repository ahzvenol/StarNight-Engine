import type { Component } from 'solid-js'
import { useSignal } from 'micro-reactive-solid'
import { lazy, Show } from 'solid-js'
import LXGWWenKai_Regular from '@/assets/LXGWWenKai-Regular.ttf'
import OPPOSans_R from '@/assets/OPPOSans-R.ttf'
import SourceHanSerifCN_Regular from '@/assets/SourceHanSerifCN-Regular.ttf'
import { Scale } from '@/utils/ui/Scale'
import { isDevelopment } from '@/utils/checkEnv'
import { store } from '@/store'
import { Dialog } from './GlobalDialog/GlobalDialog'
import { LandingPage } from './LandingPage/LandingPage'

const HomeRoot = import('./HomeRoot').then((module) => module.HomeRoot)
const GameRoot = import('./GameRoot').then((module) => module.GameRoot)
const LazyHomeRoot = lazy(async () => ({ default: await HomeRoot }))
const LazyGameRoot = lazy(async () => ({ default: await GameRoot }))

export type GUIRootPages = 'Landing' | 'Home' | 'Game'

export const GUIRootState = useSignal<GUIRootPages>('Landing')

export const GUIRoot: Component = () => {
    if (isDevelopment()) GUIRootState('Home')
    return (
        <>
            <div id="edge-fill" style={{ 'background-image': `url('${store.system.titlebackground()}')` }} />
            <div style={{ width: '100vw', height: '100vh', 'background-color': '#000' }}>
                <Scale width={2560} height={1440} mode="auto">
                    <Show when={GUIRootState() === 'Landing'}>
                        <LandingPage />
                    </Show>
                    <Show when={GUIRootState() === 'Home'}>
                        <LazyHomeRoot />
                    </Show>
                    <Show when={GUIRootState() === 'Game'}>
                        <LazyGameRoot />
                    </Show>
                    <Dialog />
                </Scale>
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
                        -moz-osx-font-smoothing: grayscale;
                        line-height: 1.5;
                        font-family:
                            WebgalUI,
                            -apple-system,
                            BlinkMacSystemFont,
                            Segoe UI,
                            Roboto,
                            Oxygen,
                            Ubuntu,
                            Cantarell,
                            Fira Sans,
                            Droid Sans,
                            Helvetica Neue,
                            sans-serif;
                    }
                    #edge-fill {
                        height: 100vh;
                        width: 100vw;
                        position: fixed;
                        filter: blur(50px);
                        background-position: center;
                        background-size: cover;
                    }
                `}
                </style>
            </div>
        </>
    )
}
