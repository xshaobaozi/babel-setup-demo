import replaceCls from './postcss/plugins/postcss-demo1/index.js'
export default {
    plugins: [
        // demo2(),
        replaceCls({
            target: 'el-',
            result: 'demo-'
        })
    ]
}