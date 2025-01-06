<script lang="ts" setup>
import { ref, watch } from 'vue';
import { LewButton, LewCheckboxGroup } from 'lew-ui'
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


// 
const deleteInvalidServer = () => {
  myrequest.get('/debug/cleanServers')
    .then(res => {
      showOkMessage('清除成功')
    }
    )
    .catch(err => {
      showFailMessage('清除失败')
      console.log(err)
    })
}

// 更新关系
const groupbyserverandtag = () => {
  myrequest.get('/debug/groupByTag')
    .then(res => {
      showOkMessage('更新成功')
    }
    )
    .catch(err => {
      showFailMessage('更新失败')
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

const options = ref([
  { label: '标准配送', value: 'standard' },
  { label: '快速配送', value: 'express' },
  { label: '次日达', value: 'nextDay' },
  { label: '同城急送', value: 'sameDay' }
])

const selectedShipping = ref('')

watch(selectedShipping, (newVal, oldVal) => {
console.log(selectedShipping.value);
})

// import { UserOutlined, DownOutlined } from '@ant-design/icons-vue';
import type { MenuProps } from 'ant-design-vue';
const handleButtonClick = (e: Event) => {
  console.log('click left button', e);
};
const handleMenuClick: MenuProps['onClick'] = e => {
  console.log('click', e);
};
</script>

<template>

  <div class="tag">
    标签信息
    <!-- <lew-button size="small" text="查询标签" type="text" @click.stop="checkBoxValuePrint" /> -->

    <!-- lew-ui 自带一个tag的组件 -->
    <lew-flex direction="x" :gap="10">
      <lew-checkbox-group v-model="selectedPlatforms" size="small" :options="tagOptions" />
    </lew-flex>

    <lew-button size="medium" :request="groupbyserverandtag" text="服务器分类" type="ghost" />
    <div>
      <lew-button size="medium" :request="deleteInvalidServer" text="删除服务器" type="ghost" />
    </div>

    <div class="demo-dropdown-wrap">
    <a-dropdown-button @click="handleButtonClick">
      下拉框
      <template #overlay>
        <a-menu @click="handleMenuClick">
          <a-menu-item key="1">
            <UserOutlined />
            1st menu item
          </a-menu-item>
          <a-menu-item key="2">
            <UserOutlined />
            2nd menu item
          </a-menu-item>
          <a-menu-item key="3">
            <UserOutlined />
            3rd item
          </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown-button>
  
  
  </div>

  </div>


  <!-- ------------------ -->


</template>

<style lang="scss" scoped></style>