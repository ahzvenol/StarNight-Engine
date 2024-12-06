import { resolve } from 'path'
import type { PluginOption } from 'vite'
import scalaJSPlugin from '@scala-js/vite-plugin-scalajs'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'
import importToCDN from 'vite-plugin-cdn-import'
import solidPlugin from 'vite-plugin-solid'
import TrackEffect from './plugins/vite-plugin-track-effect'

export default defineConfig(({ command }) => ({
    plugins: [
        solidPlugin(),
        TrackEffect(),
        importToCDN({
            modules: [
                {
                    name: 'axios',
                    var: 'axios',
                    path: 'https://cdn.bootcdn.net/ajax/libs/axios/1.2.2/axios.min.js'
                },
                {
                    name: 'localforage',
                    var: 'localforage',
                    path: 'https://cdn.bootcdn.net/ajax/libs/localforage/1.10.0/localforage.min.js'
                }
            ]
        }),
        scalaJSPlugin() as PluginOption,
        visualizer({
            filename: 'stats.html' // 默认在项目根目录下生成stats.html文件，可自定义
            // open: true //生成后自动打开浏览器查看
        }) as PluginOption
    ],
    resolve: {
        alias: {
            '@': resolve(__dirname, './src') // 设置为@ 则使用时为 "@/components/index.module.css"
        }
    },
    server: {
        port: 8888,
        strictPort: true // 设为 true 时若端口已被占用则会直接退出，而不是尝试下一个可用端口
    },
    build: {
        target: 'esnext',
        sourcemap: false
    },
    esbuild: {
        drop: command === 'build' ? ['console', 'debugger'] : []
    }
}))
