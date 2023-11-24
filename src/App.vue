<script setup>
import { ref } from 'vue'
import { printLog } from './config'
import JSXButton from './components/button.vue'
const count = ref(0)
const handleAdd = () => {
  count.value = count.value + 1
  printLog()
}
</script>

<template>
  <div>
    <el-button type="primary">test</el-button>
  </div>
</template>

<style>
body {
  color: color;
}

div {
  height: 20px;
  background-color: gray;
  color: white
}

.el-btn {
  color: green;
}
</style>
