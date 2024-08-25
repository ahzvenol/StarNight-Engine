import { Component } from 'solid-js'
import { Route } from '../router'
import Config from './Config/Config'
import { Graphic } from './Elements'
import Title from './Title/Title'
import { Store } from '@/store/default'
import { Context } from '@/store/context'

// todo:最后让AI去整理import的值和type吧
const UI: Component<{ environment: Store }> = ({ environment }) =>
    <Context environment={environment}>
        <Graphic config={environment.system}>
            <Route path="">
                <Title></Title>
            </Route>
            <Route path="Config">
                <Config></Config>
            </Route>
            <style jsx global>
                {`
                @font-face {
                    font-family: "思源宋体";
                    src: url(${require("../assets/fonts/SourceHanSerifCN-Regular.ttf")}) format("truetype");
                }
                @font-face {
                    font-family: "LXGW";
                    src: url(${require("../assets/fonts/LXGWWenKai-Regular.ttf")}) format("truetype");
                }
                @font-face {
                    font-family: "WebgalUI";
                    src: url(${require("../assets/fonts/OPPOSans-R.ttf")}) format("truetype");
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
        </Graphic >
    </Context>

export default UI