import type { RootState } from '@/store/store'
import { GoEnd, GoStart, MusicList, PlayOne, SquareSmall } from '@icon-park/react'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import useSoundEffect from '@/hooks/useSoundEffect'
import { useValue } from '@/hooks/useValue'
import { setGuiAsset } from '@/store/GUIReducer'
import { setStage } from '@/store/stageReducer'
import styles from '@/UI/Extra/extra.module.scss'

export function ExtraBgm() {
    const { playSeClick, playSeEnter } = useSoundEffect()
    // 检查当前正在播放的bgm是否在bgm列表内
    const currentBgmSrc = useSelector((state: RootState) => state.GUI.titleBgm)
    const extraState = useSelector((state: RootState) => state.userData.appreciationData)
    const initName = 'Title_BGM'
    // 是否展示 bgm 列表
    const isShowBgmList = useValue(false)
    let foundCurrentBgmName = initName
    let foundCurrentBgmIndex = -1
    const iconSize = 39
    const bgmPlayerHeight = isShowBgmList.value ? '80%' : '10%'
    const bgmListLen = extraState.bgm.length
    extraState.bgm.forEach((e, i) => {
        if (e.url === currentBgmSrc) {
            foundCurrentBgmName = e.name
            foundCurrentBgmIndex = i
        }
    })
    const currentPlayingBgmName = useValue('')
    if (foundCurrentBgmName !== initName && foundCurrentBgmName !== currentPlayingBgmName.value) {
        currentPlayingBgmName.set(foundCurrentBgmName)
    }
    const dispatch = useDispatch()

    function setBgmByIndex(index: number) {
        const e = extraState.bgm[index]
        currentPlayingBgmName.set(e.name)
        dispatch(setGuiAsset({ asset: 'titleBgm', value: e.url }))
    }

    const showBgmList = extraState.bgm.map((e, i) => {
        let className = styles.bgmElement
        if (e.name === currentPlayingBgmName.value) {
            className = className + ' ' + styles.bgmElement_active
        }
        return (
            <div
                onClick={() => {
                    playSeClick()
                    currentPlayingBgmName.set(e.name)
                    dispatch(setGuiAsset({ asset: 'titleBgm', value: e.url }))
                }}
                class={className}
                style={{
                    'animation-delay': `${i * 150}ms`
                }}
                onMouseEnter={playSeEnter}>
                {e.name}
            </div>
        )
    })
    return (
        <div class={styles.bgmContainer} style={{ 'max-height': bgmPlayerHeight }}>
            <div class={styles.bgmPlayerMain}>
                <div
                    onClick={() => {
                        playSeClick()
                        if (foundCurrentBgmIndex <= 0) {
                            setBgmByIndex(bgmListLen - 1)
                        } else {
                            setBgmByIndex(foundCurrentBgmIndex - 1)
                        }
                    }}
                    onMouseEnter={playSeEnter}
                    class={styles.bgmControlButton}>
                    <GoStart theme="filled" size={iconSize} fill="#fff" strokeWidth={3} strokeLinejoin="miter" />
                </div>
                <div
                    onClick={() => {
                        playSeClick()
                        const bgmControl: HTMLAudioElement = document.getElementById('currentBgm') as HTMLAudioElement
                        bgmControl?.play().then()
                    }}
                    onMouseEnter={playSeEnter}
                    class={styles.bgmControlButton}>
                    <PlayOne theme="filled" size={iconSize} fill="#fff" strokeWidth={3} strokeLinejoin="miter" />
                </div>
                <div
                    onClick={() => {
                        playSeClick()
                        if (foundCurrentBgmIndex >= bgmListLen - 1) {
                            setBgmByIndex(0)
                        } else {
                            setBgmByIndex(foundCurrentBgmIndex + 1)
                        }
                    }}
                    onMouseEnter={playSeEnter}
                    class={styles.bgmControlButton}>
                    <GoEnd theme="filled" size={iconSize} fill="#fff" strokeWidth={3} strokeLinejoin="miter" />
                </div>
                <div
                    onClick={() => {
                        playSeClick()
                        const bgmControl: HTMLAudioElement = document.getElementById('currentBgm') as HTMLAudioElement
                        bgmControl.pause()
                    }}
                    onMouseEnter={playSeEnter}
                    class={styles.bgmControlButton}>
                    <SquareSmall theme="filled" size={iconSize} fill="#fff" strokeWidth={3} strokeLinejoin="miter" />
                </div>
                <div class={styles.bgmName}>{foundCurrentBgmName}</div>
                <div
                    onClick={() => {
                        playSeClick()
                        isShowBgmList.set(!isShowBgmList.value)
                    }}
                    onMouseEnter={playSeEnter}
                    class={styles.bgmControlButton}
                    style={{ 'margin-left': 'auto' }}>
                    <MusicList theme="filled" size={iconSize} fill="#fff" strokeWidth={3} strokeLinejoin="miter" />
                </div>
            </div>
            {isShowBgmList.value && <div class={styles.bgmListContainer}> {showBgmList}</div>}
        </div>
    )
}
