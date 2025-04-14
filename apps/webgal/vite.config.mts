import { resolve } from 'path'
import type { PluginOption } from 'vite'
import legacy from '@vitejs/plugin-legacy'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'

export default defineConfig(({ command }) => ({
    plugins: [
        solidPlugin(),
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
            '@': resolve(__dirname, './src') // 设置为@ 则使用时为 "@/components/index.module.css"
        }
    },
    server: {
        port: 8888,
        strictPort: true // 设为 true 时若端口已被占用则会直接退出，而不是尝试下一个可用端口
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
