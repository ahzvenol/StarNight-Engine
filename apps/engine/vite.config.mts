import { resolve } from 'path'
import type { PluginOption } from 'vite'
import legacy from '@vitejs/plugin-legacy'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import scenario from './plugins/vite-plugin-scenario'

const host = process.env.TAURI_DEV_HOST

export default defineConfig(({ command }) => ({
    plugins: [
        scenario({
            src: '资源路径',
            async: '$执行',
            await: '$等待'
        }),
        solid({
            solid: {
                delegateEvents: false // 禁用solid事件委托
            }
        }),
        legacy({
            modernPolyfills: true,
            renderLegacyChunks: false
        }),
        visualizer({
            filename: 'stats.html' // 默认在项目根目录下生成stats.html文件，可自定义
            // open: true //生成后自动打开浏览器查看
        }) as PluginOption
    ],
    resolve: {
        alias: {
            '@': resolve(__dirname, './src'), // 设置为@ 则使用时为 "@/components/index.module.css"
            scenario: resolve(__dirname, './scenario') // 为剧本文件提供单独的文件夹目录
        }
    },
    clearScreen: false, // 1. prevent vite from obscuring rust errors
    // 2. tauri expects a fixed port, fail if that port is not available
    server: {
        port: 1420,
        strictPort: true,
        host: host || false,
        hmr: host
            ? {
                    protocol: 'ws',
                    host,
                    port: 1421
                }
            : undefined
    },
    watch: {
        ignored: ['**/src-tauri/**'] // 3. tell vite to ignore watching `src-tauri`
    },
    build: {
        target: 'es2015',
        sourcemap: false,
        minify: 'terser'
    },
    esbuild: {
        drop: command === 'build' ? ['console', 'debugger'] : []
    }
}))
