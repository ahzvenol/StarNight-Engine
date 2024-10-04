/* eslint-disable prettier/prettier */
module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true // 解决 'module' is not defined报错。
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:solid/recommended',
        'plugin:prettier/recommended'
    ],
    overrides: [{
        env: {
            node: true
        },
        files: ['.eslintrc.{js,cjs}'],
        parserOptions: {
            sourceType: 'script'
        }
    }],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
    },
    plugins: ['@typescript-eslint', 'solid'],
    rules: {
        'solid/no-destructure': 'off'
    }
}