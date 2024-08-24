import { Component } from 'solid-js'
import { Store } from '../store'
import { Graphic } from './Elements'
import { Route } from './router'
import Title from './Title'
import Config from './Config'

// todo:最后让AI去整理import的值和type吧
const UI: Component<{ environment: Store }> = ({ environment }) =>
    <Graphic config={environment.system['graphic']}>
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

export default UI