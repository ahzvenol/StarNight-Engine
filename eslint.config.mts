import eslint from '@eslint/js'
import clsx from 'eslint-plugin-clsx'
import prettier from 'eslint-plugin-prettier/recommended'
import solid from 'eslint-plugin-solid/configs/recommended'
import tseslint from 'typescript-eslint'

clsx.configs.recommended.plugins = { clsx: clsx }
export default tseslint.config(
    eslint.configs.recommended,
    tseslint.configs.recommended,
    prettier,
    solid,
    clsx.configs.recommended,
    {
        files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
        rules: {
            'solid/no-innerhtml': 'off', // 允许innerhtml(由于不存在非法输入)
            'solid/no-destructure': 'off', // 允许solid组件参数解构(由于项目风格是传输signal)
            'solid/event-handlers': 'error', // 禁用小写的事件侦听器,如onclick
            '@typescript-eslint/consistent-type-imports': 'error', // 如果导入类型(type),将导入类型和导出其他对象分开写
            '@typescript-eslint/no-for-in-array': 'error', // 禁止使用for in来进行数组访问
            'clsx/prefer-objects-over-logical': 'error' // 禁止在clsx()中使用逻辑表达式
        }
    }
)
