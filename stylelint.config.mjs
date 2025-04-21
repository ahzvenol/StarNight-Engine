export default {
    extends: [
        'stylelint-config-standard',
        'stylelint-config-standard-scss',
        'stylelint-config-rational-order',
        'stylelint-prettier/recommended'
    ],
    overrides: [
        {
            files: ['**/*.scss'],
            customSyntax: 'postcss-scss'
        }
    ],
    plugins: ['stylelint-scss', 'stylelint-order', 'stylelint-config-rational-order/plugin'],
    rules: {
        // 'color-function-notation': 'legacy', // 使用传统rbga函数
        // indentation: 4, // 用来定义缩进的单位
        // 'function-url-quotes': 'always', // URL 的引号 "always(必须加上引号)"|"never(没有引号)"
        // 'string-quotes': 'single', // 指定字符串使用单引号或双引号 "single(单引号)"|"double(双引号)"
        'unit-case': 'lower', // 指定单位的大小写 "lower(全小写)"|"upper(全大写)"
        'color-hex-case': 'lower', // 指定 16 进制颜色的大小写 "lower(全小写)"|"upper(全大写)"
        // 'rule-empty-line-before': 'never', // 要求或禁止在规则之前的空行 "always(规则之前必须始终有一个空行)"|"never(规则前绝不能有空行)"|"always-multi-line(多行规则之前必须始终有一个空行)"|"never-multi-line(多行规则之前绝不能有空行)"
        // 'block-opening-brace-space-before': 'always', // 要求在块的开大括号之前必须有一个空格或不能有空白符 "always(大括号前必须始终有一个空格)"|"never(左大括号之前绝不能有空格)"|"always-single-line(在单行块中的左大括号之前必须始终有一个空格)"|"never-single-line(在单行块中的左大括号之前绝不能有空格)"|"always-multi-line(在多行块中，左大括号之前必须始终有一个空格)"|"never-multi-line(多行块中的左大括号之前绝不能有空格)"
        // 'font-family-no-missing-generic-family-keyword': null, // 禁止在字体族名称列表中缺少通用字体族关键字
        // 'color-function-notation': 'legacy', // 指定颜色函数是否以逗号分割 rgba(num, num, num, num) "modern(不使用逗号)"|"legacy(使用逗号)"
        'color-hex-length': 'long', // 指定 16 进制颜色的简写或扩写 "short(16进制简写)"|"long(16进制扩写)"
        'comment-empty-line-before': 'never', // 要求或禁止在在注释之前使用空行
        'scss/double-slash-comment-empty-line-before': 'never', // 要求或禁止在在注释之前使用空行
        'scss/at-import-partial-extension': null, // 解决不能使用 @import 引入 scss 文件
        'property-no-unknown': null, // 禁止未知的属性
        // 'no-empty-source': null, // 禁止空源码
        'selector-id-pattern': null, // 强制选择器类名的格式
        'selector-class-pattern': null, // 强制选择器类名的格式
        'value-no-vendor-prefix': null, // 关闭 vendor-prefix (为了解决多行省略 -webkit-box)
        'no-descending-specificity': null, // 不允许较低特异性的选择器出现在覆盖较高特异性的选择器
        'selector-pseudo-class-no-unknown': null, // stylelint无法正确识别:global()选择器
        'property-no-vendor-prefix': null // 允许-webkit-等前缀
    },
    ignoreFiles: ['**/*.js', '**/*.jsx', '**/*.tsx', '**/*.ts']
}
