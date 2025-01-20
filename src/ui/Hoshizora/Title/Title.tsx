import type { Component } from 'solid-js'
import clsx from 'clsx'
import { router } from '@/router'
import { Button, Clone, Variable } from '@/ui/Elements'
import { restartGame } from '@/ui/Pages'
import { Pages } from '@/ui/Type'
import { log } from '@/utils/logger'
import styles from './Title.module.scss'

const Title: Component = () => {
    log.info('Title组件函数被调用')
    return (
        <div class={clsx('Page', styles.Title_container)}>
            <div class={styles.Title_button_container}>
                <Clone count={4}>
                    {(index) => (
                        <Variable value={['01start', '02load', '03config', '04gallery'][index]}>
                            {(imageId) => (
                                <>
                                    <Button
                                        class={`Title_button_${index}`}
                                        style={{
                                            'background-image': `url('./static/Texture2D/title_${imageId}.webp')`
                                        }}
                                        onClick={() => {
                                            if (index === 0) restartGame()
                                            router.navigate(
                                                [Pages.Game, Pages.Load, Pages.Config, Pages.Gallery][index]
                                            )
                                        }}
                                    />
                                    <style jsx>
                                        {`
                                            @media (hover: hover) {
                                                .Title_button_${index}:hover {
                                                    background-image: url('./static/Texture2D/title_${imageId}_on.webp') !important;
                                                }
                                            }
                                            @media (hover: none) {
                                                .Title_button_${index} {
                                                    transform: scale(1.35) translate(0, ${index * 5}px);
                                                    transform-origin: top;
                                                }
                                            }
                                        `}
                                    </style>
                                </>
                            )}
                        </Variable>
                    )}
                </Clone>
            </div>
        </div>
    )
}

export default Title
