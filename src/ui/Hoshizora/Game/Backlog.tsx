import { Clone } from '@/ui/Elements'
import Scrollbar from '@/ui/Scrollbar'
import { Signal } from '@/utils/Reactive'
import { Component, Show } from 'solid-js'
import Back from '../Back/Back'
import styles from './Backlog.module.scss'

export const Backlog: Component<{ showBacklog: Signal<boolean> }> = ({ showBacklog }) => {
    return (
        <>
            <div class={'Page' + ' ' + styles.Game_Backlog_mask} />
            <div class={'Page' + ' ' + styles.Game_Backlog_container}>
                <Scrollbar
                    container={<div class={styles.Game_Backlog_content} />}
                    content={
                        <Clone count={20}>
                            {(index) => (
                                <div class={styles.Game_Backlog_element}>
                                    <Show when={true}>
                                        <div class={styles.Game_Backlog_element_clip} />
                                    </Show>
                                    <div class={styles.Game_Backlog_element_text}>啊,不好</div>
                                    <div class={styles.Game_Backlog_element_name}>晓</div>
                                </div>
                            )}
                        </Clone>
                    }
                    track={<div class={styles.Game_Backlog_Scrollbar_track} />}
                    thumb={<div class={styles.Game_Backlog_Scrollbar_thumb} />}
                    default={1}
                />
                <Back onClick={() => showBacklog(false)} />
            </div>
        </>
    )
}
