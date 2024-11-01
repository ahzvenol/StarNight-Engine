module.exports = {
    ignorePatterns: ['.eslintrc.js', '**/lib/**'],
    env: {
        browser: true,
        es2021: true,
        node: true
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:solid/recommended',
        'plugin:prettier/recommended'
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: './tsconfig.json',
        ecmaVersion: 'latest',
        sourceType: 'module'
    },
    rules: {
        'solid/no-destructure': 'off', // 允许solid组件参数解构
        '@typescript-eslint/consistent-type-imports': 'error', // 如果导入类型（type），将导入类型和导出其他对象分开写
        '@typescript-eslint/no-for-in-array': 'error' // 禁止使用for in来进行数组访问
    }
}
