<script lang="ts" setup>

import myrequest from "@/utils/request";
import { ElMessage } from 'element-plus'
import { Search as SearchIcon, Tools } from '@element-plus/icons-vue'
import {ref} from "vue";
import FindServerView from "@/views/FindServerView.vue"

const tipsConsoleFunc = () => {
  ElMessage.success('请在控制台中查看')
}

// write your code here
const testFunc = () => {
  tipsConsoleFunc();
  myrequest.get('/debug/test_api', {})
      .then(function (response) {
        console.log("成功分支");
      })
      .catch(function (error) {
        console.log("失败分支");
        console.error(error.response.data.detail);
      });
}

const open = ref<boolean>(false);

const showModal = () => {
  open.value = true;
};

const handleOk = (e: MouseEvent) => {
  console.log(e);
  open.value = false;
};

</script>

<template>
  <div class="test-view-container">
    <el-space :size="12">
      <el-button 
        type="warning" 
        @click="testFunc"
        :icon="Tools"
      >
        调试按钮
      </el-button>
      <el-button 
        type="primary" 
        @click="showModal"
        :icon="SearchIcon"
      >
        自定义服务器浏览
      </el-button>
    </el-space>
    
    <el-dialog 
      v-model="open" 
      title="🔍 服务器浏览器" 
      width="85%"
      top="8vh"
      append-to-body
      destroy-on-close
      :close-on-click-modal="false"
      @close="handleOk"
    >
      <div class="dialog-content">
        <FindServerView/>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.test-view-container {
  width: 100%;
}

.dialog-content {
  max-height: 70vh;
  overflow-y: auto;
  padding: 10px 0;
}
</style>