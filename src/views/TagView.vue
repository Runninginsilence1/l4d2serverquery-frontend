<script lang="ts" setup>
import { ref, watch } from 'vue';
import { ElMessage } from 'element-plus'
import { Setting, Delete as DeleteIcon, Filter, Tools, EditPen } from '@element-plus/icons-vue'
import axios from 'axios';
import cc from 'clipboard';
import { onMounted } from 'vue'
import myrequest from '@/utils/request'
import { useCounterStore, useTagListStore } from '@/stores/counter';
import TagComponent from '@/components/TagComponent.vue';

const selectedTags = ref([])
// 选中了哪些
// 显示的和值
const tagOptions = ref([
  // { label: '谷歌', value: 'google' },
  // { label: '苹果', value: 'apple' },
  // { label: '微软', value: 'microsoft' },
])

// 标签管理弹窗
const tagManagerVisible = ref(false)
const tagComponentRef = ref(null)

// 封装成功和失败的气泡
const showOkMessage = (message: string) => {
  ElMessage.success(message)
}

const showFailMessage = (message: string) => {
  ElMessage.error(message)
}

watch(selectedTags, (newVal, oldVal) => {
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
    }
    )
    .catch(err => {
      showFailMessage('获取标签失败')
      console.log(err)
    })
}

// 打开标签管理弹窗
const openTagManager = () => {
  tagManagerVisible.value = true
}

// 关闭标签管理弹窗时刷新标签列表
const handleTagManagerClose = () => {
  getAllTags() // 刷新筛选区的标签列表
}

// test commit
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
  myrequest.get('/groupByTag')
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
    tags: selectedTags.value
  })
}


onMounted(() => {
  getAllTags();
})


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
  <div class="tag-view-container">
    <div class="tag-section">
      <div class="section-header">
        <h3 class="section-title">
          <el-icon><Filter /></el-icon>
          标签筛选
        </h3>
        <el-button 
          type="primary" 
          :icon="EditPen"
          @click="openTagManager"
          size="default"
        >
          标签管理
        </el-button>
      </div>
      
      <div v-if="tagOptions.length === 0" class="empty-state">
        <el-empty 
          description="暂无标签"
          :image-size="80"
        >
          <template #description>
            <div class="empty-description">
              <p class="empty-title">暂无可用标签</p>
              <p class="empty-message">点击右上角"标签管理"按钮添加标签，或点击下方"服务器分类"按钮自动创建标签</p>
            </div>
          </template>
        </el-empty>
      </div>
      
      <el-checkbox-group v-else v-model="selectedTags" size="large">
        <el-checkbox 
          v-for="option in tagOptions" 
          :key="option.value" 
          :label="option.value"
          border
        >
          {{ option.label }}
        </el-checkbox>
      </el-checkbox-group>
    </div>
    
    <!-- 标签管理弹窗 -->
    <el-dialog
      v-model="tagManagerVisible"
      title="🏷️ 标签管理"
      width="800px"
      append-to-body
      destroy-on-close
      @close="handleTagManagerClose"
    >
      <TagComponent ref="tagComponentRef" />
    </el-dialog>

    <el-divider />

    <div class="action-section">
      <h3 class="section-title">
        <el-icon><Tools /></el-icon>
        管理操作
      </h3>
      <el-space wrap :size="12">
        <el-button 
          type="primary" 
          @click="groupbyserverandtag"
          :icon="Setting"
        >
          服务器分类
        </el-button>
        <el-button 
          type="danger" 
          @click="deleteInvalidServer"
          :icon="DeleteIcon"
        >
          清理无效服务器
        </el-button>
      </el-space>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tag-view-container {
  width: 100%;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--retro-text-main); /* Updated color */
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  
  .el-icon {
    font-size: 18px;
  }
}

.tag-section {
  margin-bottom: 20px;
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }
  
  .empty-state {
    padding: 20px 0;
    
    .empty-description {
      .empty-title {
        font-size: 16px;
        font-weight: 600;
        color: var(--retro-text-main); /* Updated color */
        margin-bottom: 8px;
      }
      
      .empty-message {
        font-size: 14px;
        color: var(--retro-text-dim); /* Updated color */
        line-height: 1.6;
        max-width: 450px;
        margin: 0 auto;
      }
    }
  }
  
  :deep(.el-checkbox-group) {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }
  
  :deep(.el-checkbox.is-bordered) {
    margin-right: 0;
    padding: 10px 20px;
    border-radius: 6px;
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-2px);
      /* box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); REMOVED for retro theme */
    }
  }
}

.action-section {
  :deep(.el-button) {
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-2px);
      /* box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15); REMOVED for retro theme */
    }
  }
}
</style>