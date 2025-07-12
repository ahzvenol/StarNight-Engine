import type { Component } from 'solid-js'
import { Clipboard } from '@capacitor/clipboard'
import { omit, toMerged } from 'es-toolkit'
import * as LZString from 'lz-string'
import { useSignal } from 'micro-reactive-solid'
import { Show } from 'solid-js'
import { useStore } from '@/store/context'
import { Either } from '@/utils/fp/Either'
import { Try } from '@/utils/fp/Try'
import styles from './Hakuuyosei.module.scss'

export const ExportImport: Component = () => {
    const store = useStore()
    const state = useSignal<Either<string, string> | null>(null)
    const importFn = () => {
        const result = Clipboard.read().then((res) => res.value)
        result
            .then((data) =>
                Either.right(data)
                    .flatMap((data) =>
                        data.startsWith('SL://') ? Either.right(data.substring(5)) : Either.left('数据格式有误')
                    )
                    .flatMap((lz) =>
                        Try.apply(() => LZString.decompressFromBase64(lz))
                            .orElse(Try.failure<string>('数据解析失败'))
                            .toEither()
                    )
                    .flatMap((raw) =>
                        Try.apply(() => JSON.parse(raw))
                            .orElse(Try.failure<string>('数据解析失败'))
                            .toEither()
                    )
                    .map((obj) => toMerged(store(), omit(obj, ['system'])))
                    .map((obj) => store(obj))
                    .map(() => '导入成功')
            )
            .catch(() => Either.left('剪贴板读取失败'))
            .then((either) => state(either))
    }
    const exportFn = () => {
        const result = `SL://${LZString.compressToBase64(JSON.stringify(store()))}`
        Clipboard.write({ string: result })
            .then(() => state(Either.right('导出成功')))
            .catch(() => state(Either.left('导出失败')))
    }

    return (
        <div class={styles.Hakuuyosei_export_import_container}>
            <div style={{ width: `145px` }} class={styles.Hakuuyosei_button} onClick={exportFn}>
                导出数据到剪贴板
            </div>
            <div style={{ left: '155px', width: `145px` }} class={styles.Hakuuyosei_button} onClick={importFn}>
                从剪贴板导入数据
            </div>
            <Show when={state()}>
                <div
                    style={{ left: '310px', top: '5px' }}
                    class={state()!.isLeft() ? styles.Hakuuyosei_warn : styles.Hakuuyosei_success}
                >
                    {state()!.isLeft() ? state()!.left.get() : state()!.right.get()}
                </div>
            </Show>
        </div>
    )
}
