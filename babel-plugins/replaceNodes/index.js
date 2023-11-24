import * as babel from '@babel/core';
import vue from '@vitejs/plugin-vue'
import * as parser from "@babel/parser";
import vueJsx from '@vitejs/plugin-vue-jsx';
import * as types from '@babel/types'
import traverse from '@babel/traverse'
import generate from "@babel/generator";
const replaceStrFn = (str, prefix, replace) => {
    const reg = new RegExp(`((^|(\\s)+|\\.|=|\\-\\-))${prefix}`, 'g');
    return str.replace(reg, `$1${replace}`);
}
const vaildateReplaceStr = (str, prefix) => {
    const reg = new RegExp(`((^|(\\s)+|\\.|=|\\-\\-))${prefix}`, 'g');
    return reg.test(str)
}
export default replaceVueNodes = function (options = {}) {
    return {
        name: 'replace-vue-nodes',
        async transform(code, id, opt) {
            const plugins = []
            if (id.endsWith('css')) {
                return 
            }
            // if (!id.endsWith('.vue') && !id.endsWith('.jsx') && !id.endsWith('.tsx') && !id.endsWith('.ts') && !id.endsWith('.js')) {
            //     return
            // }
            plugins.push(vue, vueJsx)
            const result = babel.transformSync(code, {
                babelrc: false,
                ast: true,
                plugins: [],
                sourceFileName: id,
                configFile: false
            });

            traverse(result.ast, {
                StringLiteral(path) {
                    const { target, replaceStr } = options
                    if (vaildateReplaceStr(path.node.value, target)) {
                        if (path.parent?.key?.name === 'class' || path.parent?.key?.value === 'class') {
                            const newNode = types.StringLiteral(replaceStrFn(path.node.value, target, replaceStr));
                            path.replaceWith(newNode)
                        }
                    }
                },
            })
            const generatorCode = generate(result.ast)
            return {
                code: generatorCode.code,
                map: result.map
            };
        },
    }
}