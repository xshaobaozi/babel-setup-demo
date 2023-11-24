import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import generate from '@babel/generator';
import types from '@babel/types'
// 源代码
const sourceCode = `
    [1,2,3].map(n => n + 1);
    const fn =(a,b) => a + 1;
    () => {return 2 + 2}
`
// 生成 AST
const ast = parse(sourceCode, {
    sourceType: 'unambiguous',
});
console.log(ast)

// 遍历 AST
traverse.default(ast, {
    // 遍历所有的箭头函数
    ArrowFunctionExpression(path, state) {
        console.log(path, state)
        if (types.isBlockStatement(path.node.body)) {
            const functionExpressionNode = types.functionExpression(null, path.node.params, path.node.body)
            path.replaceWith(functionExpressionNode)
            return
        }
        const returnStatementNode = types.returnStatement(path.node.body)
        const blockStatementNode = types.blockStatement([returnStatementNode])
        const functionExpressionNode = types.functionExpression(null, path.node.params, blockStatementNode)
        path.replaceWith(functionExpressionNode)
    }
});
// 生成代码
const { code, map } = generate.default(ast);
console.log(code);

