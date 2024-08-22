import { Component } from 'solid-js'
import { Store } from '../store'
import { Graphic } from './Elements'
import { Route } from './router'
import Title from './Title'

// todo:最后让AI去整理import的值和type吧
const UI: Component<{ environment: Store }> = ({ environment }) =>
    <Graphic config={environment.system['graphic']}>
        <Route path="">
            <Title></Title>
        </Route>
        <Route path="Config">
            {/* <Config></Config> */}
        </Route>
        <style jsx global>
            {`
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