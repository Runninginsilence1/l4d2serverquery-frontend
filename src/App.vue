<script lang="ts" setup>
import TableView from './views/TableView.vue';
import AddServerView from './views/AddServerView.vue';
import TagView from './views/TagView.vue';
import { ref } from 'vue';
import { LewButton } from 'lew-ui'
import axios from 'axios';
import { LewMessage } from 'lew-ui';
import cc from 'clipboard';
import TestView from "@/views/TestView.vue";


</script>

<template>

<!--  -->


  <div class="tag">
    <TestView />
    <TagView />
  </div>
  <!-- 用来展示信息的表格 -->

  <div class="table">
    <TableView />
  </div>

  <div class="add">
    <AddServerView />
  </div>


  <!-- 标签和一些启动测试用的东西 -->
  
  <!-- 添加服务器的地方 -->
  
</template>

<style lang="scss" scoped>
.tag {
  // border-style: groove;
  // border-color: greenyellow;
}

.table {
  //margin-top: 10vh;
  // border-style: groove;
  // border: aqua 1px solid;
}

.add {
  margin-top: 10vh;
  // border-style: groove;
  // border-color: red;
}
</style>