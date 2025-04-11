import eslint from '@eslint/js'
import prettier from 'eslint-plugin-prettier/recommended'
import tseslint from 'typescript-eslint'

export default tseslint.config(eslint.configs.recommended, tseslint.configs.recommended, prettier, {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
        '@typescript-eslint/consistent-type-imports': 'error', // 如果导入类型(type),将导入类型和导出其他对象分开写
        '@typescript-eslint/no-for-in-array': 'error' // 禁止使用for in来进行数组访问
    }
})
