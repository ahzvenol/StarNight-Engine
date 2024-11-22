import type { Component } from 'solid-js'
import { router } from '@/router'
import { Button, Clone, line, Variable } from '@/ui/Elements'
import { Pages, restartGame } from '@/ui/Pages'
import { log } from '@/utils/Logger'
import styles from './Title.module.scss'

const Title: Component = () => {
    log.info('Title组件函数被调用')
    return (
        <div class={'Page' + ' ' + styles.Title_container}>
            <Clone count={4}>
                {(index) => (
                    <Variable value={['01start', '02load', '03config', '04gallery'][index]}>
                        {(imageId) => (
                            <>
                                <Button
                                    class={`Title_button_${index}`}
                                    style={{
                                        width: `121px`,
                                        height: `26px`,
                                        right: `570px`,
                                        bottom: `${55 + 41 * (4 - line(4)(index))}px`,
                                        'background-image': `url('./static/Texture2D/title_${imageId}.png')`
                                    }}
                                    onClick={() => {
                                        if (index === 0) restartGame()
                                        router.navigate([Pages.Game, Pages.Load, Pages.Config, Pages.Gallery][index])
                                    }}
                                />
                                <style jsx>
                                    {`
                                        .Title_button_${index}:hover {
                                            background-image: url('./static/Texture2D/title_${imageId}_on.png') !important;
                                        }
                                    `}
                                </style>
                            </>
                        )}
                    </Variable>
                )}
            </Clone>
        </div>
    )
}

export default Title
