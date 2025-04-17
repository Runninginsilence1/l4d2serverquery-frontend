<script lang="ts" setup>
import { ref } from 'vue';
import {LewButton, LewCheckboxGroup} from 'lew-ui'
import axios from 'axios';
import { LewMessage } from 'lew-ui';
import cc from 'clipboard';
import { onMounted } from 'vue'
import myrequest from '@/utils/request'


// 对话框是否显示
const visible = ref(false)
// 关闭按钮回调
const ok = () => {
  return new Promise<void>(() => {
    setTimeout(() => {
      visible.value = false
    }, 1000)
  })
}

// 我这里当然要提前写好数据结构
const selectedPlatforms = ref([
{
  id: 1,
        name: "萌新聚集地"
}
])
// 选中了哪些
// 显示的和值
const tagOptions = ref([
  { label: '谷歌', value: 'google' },
  { label: '苹果', value: 'apple' },
  { label: '微软', value: 'microsoft' },
])

// 封装成功和失败的气泡
const showOkMessage = (message: string) => {
  LewMessage.success({
    content: message,
    duration: 3000
  })
}

const showFailMessage = (message: string) => {
  LewMessage.error({
    content: message,
    duration: 3000
  })
}


// api 请求
// 修改远端服务器地址;
const baseUrl = 'https://localhost:44316';
// const baseUrl = 'http://121.37.157.126:5000';

const instance = axios.create({
  baseURL: baseUrl,
  timeout: 3000,
  // headers: {'X-Custom-Header': 'foobar'}
});


// 查询选中的tag
const getAllTags = () => {
  instance.get('/getAllTags')
  .then(res => {
    const tagArray = res.data.map(item => {
      return { label: item.name, value: item.id }
    })

    tagOptions.value = tagArray

    showOkMessage('获取标签成功')
  }
    )
    .catch(err => {
      showFailMessage('获取标签失败')
      console.log(err)
    })
  }
  
// 发送选中的tag
const sendTags = () => {
  myrequest.post('/sendTags', {
    platforms: selectedPlatforms.value
  })
}

onMounted(() => {
  getAllTags();
})


</script>

<template>



<div class="tag">
    标签信息
    <!-- <lew-button size="small" text="查询标签" type="text" @click.stop="checkBoxValuePrint" /> -->

    <!-- lew-ui 自带一个tag的组件 -->
    <lew-flex direction="y" :gap="10">
      <lew-checkbox-group v-model="selectedPlatforms" size="small" :options="tagOptions" />
    </lew-flex>

    <lew-button size="medium" :request="getAllTags" text="查询" type="ghost" />

  </div>


<!-- ------------------ -->

<lew-modal
    v-model:visible="visible"
    closeOnClickOverlay
    width="450px"
    :okProps="{ request: ok }"
    @cancel="visible = false"
  >
  <div class="lew-modal-body">
      <div>在这里添加玩家信息表格</div>
    </div>

</lew-modal>

</template>

<style lang="scss" scoped>
.info {
  line-height: 22px;

  .name {
    font-weight: bold;
  }

  .brand {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 12px;
    white-space: nowrap;
    color: var(--lew-text-color-7);
  }
}
</style>

