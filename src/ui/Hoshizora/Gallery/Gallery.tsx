import { Clone, Variable } from '@/ui/Elements'
import { useSignal } from '@/utils/Reactive'
import { Component, Show } from 'solid-js'
import { CGElement } from './CGElement'
import styles from './Gallery.module.scss'

const CG = [
    ['evcg01', 'a', 'b', 'c', 'c2', 'd', 'e'],
    ['evcg20', 'a', 'b', 'c', 'd'],
    ['evcg02', 'a', 'b', 'c', 'd', 'e'],
    ['evcg03', 'a'],
    ['evcg04', 'a', 'b', 'c', 'd'],
    ['evcg05', 'a', 'b'],
    ['evcg06', 'a', 'b'],
    ['evcg07', 'a', 'b'],
    ['evcg21', 'a', 'b', 'c', 'd', 'e', 'f'],
    ['evcg08', 'a', 'b'],
    ['evcg09', 'a', 'b'],
    ['evcg10', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l'],
    ['evcg11', 'a', 'b', 'c', 'd'],
    ['evcg12', 'a', 'b', 'c'],
    ['evcg13', 'a', 'a2', 'b', 'c'],
    ['evcg19', 'a'],
    ['evcg18', 'b', 'c', 'd'],
    ['evcg14', 'a', 'b'],
    ['evcg15', 'a'],
    ['evcg16', 'a'],
    ['evcg17', 'a']
]

const Gallery: Component = () => {
    const currentPage = useSignal<1 | 2>(1)
    return (
        <div class={'Page' + ' ' + styles.Gallery_container}>
            <div id={styles.Gallery_CG_container} />
            <div
                classList={{
                    [styles.Gallery_switch]: true,
                    [styles.Gallery_switch_1]: true,
                    [styles.Gallery_switch_hover]: currentPage() !== 1
                }}
                onClick={() => currentPage(1)}>
                1
            </div>
            <div
                classList={{
                    [styles.Gallery_switch]: true,
                    [styles.Gallery_switch_2]: true,
                    [styles.Gallery_switch_hover]: currentPage() !== 2
                }}
                onClick={() => currentPage(2)}>
                2
            </div>
            <div class={styles.Gallery_content}>
                <Clone count={16}>
                    {(index) => (
                        <Show
                            when={!(currentPage() === 2 && index + 1 > 5)}
                            fallback={
                                <div
                                    class={styles.Gallery_content_element + ' ' + styles.Gallery_content_element_empty}
                                />
                            }>
                            <Variable value={() => CG[index + (currentPage() - 1) * 16]}>{CGElement}</Variable>
                        </Show>
                    )}
                </Clone>
            </div>
        </div>
    )
}

export default Gallery
