import type { Component } from 'solid-js'
import { useSignal } from 'micro-reactive-solid'
import { Show } from 'solid-js'
import LXGWWenKai_Regular from '@/assets/LXGWWenKai-Regular.ttf'
import OPPOSans_R from '@/assets/OPPOSans-R.ttf'
import SourceHanSerifCN_Regular from '@/assets/SourceHanSerifCN-Regular.ttf'
import Scale from '@/core/ui/Scale'
import { isDevelopment } from '@/utils/checkEnv'
import { GameRoot } from './GameRoot'
import Dialog from './GlobalDialog/GlobalDialog'
import { HomeRoot } from './HomeRoot'
import LandingPage from './LandingPage/LandingPage'

export type GUIRootPages = 'Landing' | 'Home' | 'Game'

export const GUIRootState = useSignal<GUIRootPages>('Landing')

export const GUIRoot: Component = () => {
    if (isDevelopment()) GUIRootState('Home')
    return (
        <div style={{ width: '100vw', height: '100vh', 'background-color': '#000' }}>
            <Scale width={2560} height={1440} mode={'auto'}>
                <Show when={GUIRootState() === 'Landing'}>
                    <LandingPage />
                </Show>
                <Show when={GUIRootState() === 'Home'}>
                    <HomeRoot />
                </Show>
                <Show when={GUIRootState() === 'Game'}>
                    <GameRoot />
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
                `}
            </style>
        </div>
    )
}
