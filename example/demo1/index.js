import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import generate from '@babel/generator';
import types from '@babel/types'
import template from '@babel/template'
const sourceCode = `
    console.log("filename: (2, 4)", 1);

    function func() {
    console.info("filename: (5, 8)", 2);
    }

    export default class Clazz {
    say() {
        console.debug("filename: (10, 12)", 3);
    }

    render() {
        return <div>{console.error("filename: (13, 25)", 4)}</div>;
    }

    }
`
const ast = parse(sourceCode, {
    sourceType: 'unambiguous',
    plugins: ['jsx']
});

const targetCalleeName = ['log', 'info', 'error', 'debug'].map(item => `console.${item}`);

traverse.default(ast, {
    CallExpression(path, state) {
        if (path.node.isNew) {
            return;
        }
        const calleeName = generate.default(path.node.callee).code;
         if (targetCalleeName.includes(calleeName)) {
            const { line, column } = path.node.loc.start;

            const newNode = template.default.expression(`console.log("filename: (${line}, ${column})")`)();
            newNode.isNew = true;

            if (path.findParent(path => path.isJSXElement())) {
                path.replaceWith(types.arrayExpression([newNode, path.node]))
                path.skip();
            } else {
                path.insertBefore(newNode);
            }
        }
    }
});

const { code, map } = generate.default(ast);
console.log(code);