import { Reactive, useReactive } from 'micro-reactive'
import { Component, Show } from 'solid-js'
import { Clone, Element, Graphics, Route, Variable, column, line, navigate } from './Elements'
import { Store } from '../store'

const UI: Component<{ environment: Store }> = ({ environment }) =>
    <Graphics config={environment.config['graphics']}>
        <Route path="/">{
            () =>
                <Element style="width: 100%;height: 100%;background-image: url(title_bg.png);">
                    <Clone count={4}>{
                        (index) => <>
                            <Element
                                class={`menu-${index}`}
                                style={{
                                    width: `121px`,
                                    height: `26px`,
                                    right: `570px`,
                                    bottom: `${55 + 41 * (4 - line(4)(index))}px`,
                                    'background-image': `url('title_${['01start', '02load', '03config', '04gallery'][index]}.png')`
                                }}
                                onclick={() => navigate(['/game','/load', '/config', '/gallery'][index])} />
                            <style jsx>
                                {`
                                .menu-${index}:hover {
                                    background-image: url('title_${['01start', '02load', '03config', '04gallery'][index]}_on.png')!important;,
                                    }
                            `}
                            </style>
                        </>
                    }</Clone>
                </Element>
        }</Route>
        <Route path="/load">{() => <></>}</Route>
        <Route path="/config">{() => <></>}</Route>
        <Route path="/gallery">{() => <></>}</Route>
    </Graphics >


export default UI