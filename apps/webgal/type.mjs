import { Project, TypeFormatFlags } from 'ts-morph'

const project = new Project({
    tsConfigFilePath: './tsconfig.json'
})

// ② 获取源码文件和类型别名声明
const sourceFile = project.getSourceFileOrThrow('src/core/scripts/index.ts')
const wwwTypeAlias = sourceFile.getTypeAliasOrThrow('www') // www 是 type alias 名称
const aliasType = wwwTypeAlias.getType()

const checker = project.getTypeChecker().compilerObject
// ④ 通过 checker.typeToString 展示完整类型
const fullTypeText = checker.typeToString(
    aliasType.compilerType, // 从 ts-morph 的 Type 拿到底层 ts.Type
    wwwTypeAlias.compilerNode,
    TypeFormatFlags.None |
        TypeFormatFlags.NoTruncation |
        TypeFormatFlags.InTypeAlias |
        TypeFormatFlags.NoAlias |
        TypeFormatFlags.UseFullyQualifiedType |
        TypeFormatFlags.WriteTypeArgumentsOfSignature |
        TypeFormatFlags.MultilineObjectLiterals |
        TypeFormatFlags.WriteClassExpressionAsTypeLiteral |
        TypeFormatFlags.UseAliasDefinedOutsideCurrentScope
)

console.log(fullTypeText)
