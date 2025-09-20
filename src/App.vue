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
import myrequest from './utils/request';

// test mock
const testMock = () => {
  myrequest.get('/user/list')
    .then(res => {
      console.log("call test mock ok");
      
      console.log(res);
    }
    )
    .catch(err => {
      console.log("call test mock fail");
      console.error(err);
    })
}

// testMock()

</script>

<template>

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

</template>

<style lang="scss" scoped>
.tag {
  // background-color: green;
}

.table {
  // background-color: skyblue;
}

.add {
  // background-color: red;
}
</style>