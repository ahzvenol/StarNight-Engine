import { defineConfig } from 'tsup'

export default defineConfig({
    entry: ['src/index.ts'], // 你的入口文件
    format: ['esm', 'cjs'], // 输出模块格式
    target: 'es2015', // 指定 ES 版本
    dts: true, // 生成 TypeScript 声明文件
    minify: true, // 压缩输出代码
    clean: true, // 构建前清理输出目录
    sourcemap: true // 生成 source map
})
