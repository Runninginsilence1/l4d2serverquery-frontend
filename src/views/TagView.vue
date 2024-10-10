<script lang="ts" setup>
import { ref, watch } from 'vue';
import {LewButton, LewCheckboxGroup} from 'lew-ui'
import axios from 'axios';
import { LewMessage } from 'lew-ui';
import cc from 'clipboard';
import { onMounted } from 'vue'
import myrequest from '@/utils/request'
import { useCounterStore, useTagListStore } from '@/stores/counter';



const selectedPlatforms = ref([])
// 选中了哪些
// 显示的和值
const tagOptions = ref([
  // { label: '谷歌', value: 'google' },
  // { label: '苹果', value: 'apple' },
  // { label: '微软', value: 'microsoft' },
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



watch(selectedPlatforms, (newVal, oldVal) => {
  const store = useTagListStore()
  store.updateTagList(newVal)
})

// api 请求
// 修改远端服务器地址;

// 查询选中的tag
const getAllTags = () => {
  myrequest.get('/tags')
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
    tags: selectedPlatforms.value
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

    <!-- <lew-button size="medium" :request="getAllTags" text="查询" type="ghost" /> -->

  </div>


<!-- ------------------ -->


</template>

<style lang="scss" scoped>
</style>