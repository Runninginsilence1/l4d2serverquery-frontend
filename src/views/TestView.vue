<script lang="ts" setup>

import myrequest from "@/utils/request";
import {LewAlert, LewButton, LewMessage} from "lew-ui";
import {ref} from "vue";
import FindServerView from "@/views/FindServerView.vue"

const tipsConsoleFunc = () => {
  LewMessage.success({
    content: '请在控制台中查看',
    duration: 3000
  })
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

        // error.response, 这个是响应信息
        // response.status, 这个是 http 的状态码
        // response.data.code, api 返回的状态码
        // response.data.message, api 返回的提示信息
        // response.data.data, api 返回的数据
        // response.data.error, api 返回的错误信息

        // 对于我来说, 这里统一规定写的是 detail 就好了


      });
}

// 
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
  <a-flex :gap="5">
    <lew-button size="medium" :request="testFunc" text="调试按钮" type="ghost"/>
    <a-button type="primary" @click="showModal">自定义服务器</a-button>

  </a-flex>
  <a-modal style="width: auto" class="lew-modal" v-model:open="open" title="Basic Modal" @ok="handleOk">
    <FindServerView/>
  </a-modal>
</template>

<style scoped lang="scss">
</style>