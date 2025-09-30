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
                    sortTypesGroup: true, // 类型导入单独排序
                    groups: ['type', 'builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object']
                }
            ],
            'import/consistent-type-specifier-style': 'error',
            '@stylistic/operator-linebreak': ['error', 'before', { overrides: { '=': 'after' } }], // 操作符写在每一行前面，'='除外
            '@stylistic/max-statements-per-line': ['error', { max: 1, ignoredNodes: ['IfStatement'] }], // 允许同一行有if表达式和其他表达式
            '@stylistic/lines-between-class-members': 'off', // 允许类成员之间不换行
            '@stylistic/jsx-one-expression-per-line': 'off', // 允许jsx同一行有多个表达式
            'import/no-unresolved': 'off', // 无意义的规则
            'solid/no-innerhtml': 'off', // 允许innerhtml(由于不存在非法输入)
            'solid/no-destructure': 'off', // 允许solid组件参数解构(由于项目风格是传递signal)
            'solid/event-handlers': 'error', // 禁用小写的事件侦听器,如onclick
            '@typescript-eslint/consistent-type-imports': 'error', // 将类型导入和其他导入分开写
            '@typescript-eslint/no-for-in-array': 'error', // 禁止使用for in来进行数组访问
            'clsx/prefer-objects-over-logical': 'error' // 禁止在clsx()中使用逻辑表达式
        }
    },
    {
        files: ['**/*.scenario.ts', '**/*.scenario.tsx', '**/*.scenario.js', '**/*.scenario.jsx'],
        rules: {
            'no-fallthrough': 'off', // 剧本可以使用while-switch模拟goto
            'no-unused-labels': 'off', // 剧本使用标签标记特殊语义
            '@typescript-eslint/no-unused-expressions': 'off', // 剧本中的正常情况
            '@stylistic/semi': 'off' // <div />;\n<div /> 会导致格式化错误
        }
    }
)
