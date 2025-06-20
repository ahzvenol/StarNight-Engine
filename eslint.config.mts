import eslint from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'
import clsx from 'eslint-plugin-clsx'
import solid from 'eslint-plugin-solid'
import tseslint from 'typescript-eslint'
import sortimport from 'eslint-plugin-import'

clsx.configs.recommended.plugins = { clsx: clsx }
export default tseslint.config(
    eslint.configs.recommended,
    tseslint.configs.recommended,
    solid.configs['flat/recommended'],
    clsx.configs.recommended,
    stylistic.configs.customize({
        indent: 4,
        quotes: 'single',
        semi: false,
        commaDangle: 'never',
        quoteProps: 'as-needed',
        braceStyle: '1tbs',
        arrowParens: true
    }),
    {
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname
            }
        }
    },
    {
        files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
        extends: [sortimport.flatConfigs.recommended, sortimport.flatConfigs.typescript],
        settings: {
            'import/internal-regex': '^@/'
        },
        rules: {
            'import/order': [
                'error',
                {
                    // sortTypesGroup: true, // 这条规则还没发布
                    groups: ['type', 'builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object']
                }
            ],
            'import/consistent-type-specifier-style': 'error',
            '@stylistic/operator-linebreak': ['error', 'before', { overrides: { '=': 'after' } }],
            '@stylistic/lines-between-class-members': 'off',
            'import/no-unresolved': 'off',
            'solid/no-innerhtml': 'off', // 允许innerhtml(由于不存在非法输入)
            'solid/no-destructure': 'off', // 允许solid组件参数解构(由于项目风格是传输signal)
            'solid/event-handlers': 'error', // 禁用小写的事件侦听器,如onclick
            '@typescript-eslint/consistent-type-imports': 'error', // 如果导入类型(type),将导入类型和导出其他对象分开写
            '@typescript-eslint/no-for-in-array': 'error', // 禁止使用for in来进行数组访问
            'clsx/prefer-objects-over-logical': 'error' // 禁止在clsx()中使用逻辑表达式
        }
    },
    {
        files: ['**/*.scenario.ts', '**/*.scenario.tsx', '**/*.scenario.js', '**/*.scenario.jsx'],
        rules: {
            'no-fallthrough': 'off', // 剧本可以使用while-switch模拟goto
            'no-unused-labels': 'off', // 剧本使用标签标记对话说话人
            '@typescript-eslint/no-unused-expressions': 'off', // 剧本中的正常情况
            '@stylistic/semi': 'off' // <div />;\n<div /> 会导致格式化错误
        }
    }
)
