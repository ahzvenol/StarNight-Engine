import type { Reactive } from 'micro-reactive-solid'
import type { Component } from 'solid-js'
import { Slider as BaseSlider } from '@/utils/ui/Slider'

export const Slider: Component<{ signal: Reactive<number> }> = ({ signal }) => (
    <BaseSlider
        track={(
            <div style={{ 'box-sizing': 'border-box', width: '500px', height: '63px', 'padding-top': '15px' }}>
                <div
                    style={{
                        width: '100%',
                        height: '10px',
                        cursor: 'pointer',
                        'box-shadow': '1px 1px 7px rgba(0, 0, 0, 0.3)',
                        background: 'rgba(81, 110, 65, 0.9)',
                        'border-radius': '2em',
                        transform: 'translate(0,5px)'
                    }}
                />
            </div>
        )}
        fill={(
            <div
                style={{
                    visibility: 'hidden',
                    width: '0%',
                    height: '10px',
                    transform: 'translate(0,-50%)'
                }}
            />
        )}
        thumb={(
            <div
                style={{
                    height: '36px',
                    width: '36px',
                    'border-radius': '5em',
                    background: '#ffffff',
                    cursor: 'pointer',
                    'box-shadow': '0 0 5px rgba(0, 0, 0, 0.5)',
                    transform: 'translate(-50%,-50%)'
                }}
            />
        )}
        signal={signal}
    />
)
