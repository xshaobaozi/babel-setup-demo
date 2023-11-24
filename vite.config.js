import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// import vueJsx from '@vitejs/plugin-vue-jsx';
import vueJsx from './babel-plugins/plugin-vue-jsx/dist/index.mjs';
import postcss from './postcss.config'
import replaceVueNodes from './babel-plugins/replaceNodes'
import path from 'path';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx(), replaceVueNodes({
    target: 'el-',
    replaceStr: 'demo-'
  })],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  css: {
    postcss,
  }
})
