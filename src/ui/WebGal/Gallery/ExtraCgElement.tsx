import React from 'react'
import useSoundEffect from '@/hooks/useSoundEffect'
import { useValue } from '@/hooks/useValue'
import styles from '@/UI/Extra/extra.module.scss'

interface IProps {
    name: string
    imgUrl: string
    transformDeg: number
    index: number
}

export function ExtraCgElement(props: IProps) {
    const showFull = useValue(false)
    const { playSeEnter, playSeClick } = useSoundEffect()
    return (
        <>
            {showFull.value && (
                <div
                    onClick={() => {
                        showFull.set(!showFull.value)
                        playSeClick()
                    }}
                    class={styles.showFullContainer}
                    onMouseEnter={playSeEnter}>
                    <div class={styles.showFullCgMain}>
                        <div
                            style={{
                                'background-image': `url('${props.imgUrl}')`,
                                'background-size': `cover`,
                                'background-position': 'center',
                                width: '100%',
                                height: '100%'
                            }}
                        />
                    </div>
                </div>
            )}
            <div
                onClick={() => {
                    showFull.set(!showFull.value)
                    playSeClick()
                }}
                onMouseEnter={playSeEnter}
                style={{
                    // transform: `rotate(${deg}deg)`,
                    animation: `cg_softIn_${props.transformDeg} 1.5s ease-out ${100 + props.index * 100}ms forwards `
                }}
                class={styles.cgElement}>
                <div
                    style={{
                        'background-image': `url('${props.imgUrl}')`,
                        'background-size': `cover`,
                        'background-position': 'center',
                        width: '100%',
                        height: '100%'
                    }}
                />
            </div>
        </>
    )
}
