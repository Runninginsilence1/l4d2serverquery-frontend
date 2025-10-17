<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { Delete, Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import myrequest from '@/utils/request'

const tagList: any = ref([])
const newTagName = ref('')
const loading = ref(false)
const addLoading = ref(false)

// 获取所有标签
const getAllTags = () => {
  loading.value = true
  // 🔴 后端API #1: 获取所有标签
  myrequest.get('/tags')
    .then(res => {
      tagList.value = res.data
      loading.value = false
    })
    .catch(err => {
      ElMessage.error('获取标签列表失败')
      console.error(err)
      loading.value = false
    })
}

// 添加新标签
const addTag = () => {
  if (!newTagName.value.trim()) {
    ElMessage.warning('请输入标签名称')
    return
  }
  
  addLoading.value = true
  // 🔴 后端API #2: 添加新标签
  // 请求体: { name: "标签名称" }
  myrequest.post('/tags', {
    name: newTagName.value.trim()
  })
    .then(res => {
      ElMessage.success('添加标签成功')
      newTagName.value = ''
      getAllTags() // 刷新列表
      addLoading.value = false
    })
    .catch(err => {
      ElMessage.error('添加标签失败')
      console.error(err)
      addLoading.value = false
    })
}

// 删除标签
const deleteTag = (row: any) => {
  ElMessageBox.confirm(
    `确定要删除标签 "${row.name}" 吗？此操作不可恢复。`,
    '删除确认',
    {
      confirmButtonText: '确定删除',
      cancelButtonText: '取消',
      type: 'warning',
      confirmButtonClass: 'el-button--danger'
    }
  ).then(() => {
    // 🔴 后端API #3: 删除标签
    myrequest.delete(`/tags/${row.id}`)
      .then(res => {
        ElMessage.success('删除标签成功')
        getAllTags() // 刷新列表
      })
      .catch(err => {
        ElMessage.error('删除标签失败')
        console.error(err)
      })
  }).catch(() => {
    // 用户取消删除
  })
}

// 组件挂载时获取标签列表
onMounted(() => {
  getAllTags()
})

// 暴露刷新方法给父组件
defineExpose({
  refresh: getAllTags
})
</script>

<template>
  <div class="tag-manager">
    <!-- 添加标签区域 -->
    <div class="add-tag-section">
      <el-input
        v-model="newTagName"
        placeholder="请输入新标签名称"
        size="large"
        clearable
        maxlength="20"
        show-word-limit
        @keyup.enter="addTag"
        class="tag-input"
      >
        <template #prefix>
          <el-icon><Plus /></el-icon>
        </template>
      </el-input>
      <el-button
        type="primary"
        size="large"
        :loading="addLoading"
        @click="addTag"
        :icon="Plus"
      >
        添加标签
      </el-button>
    </div>

    <el-divider />

    <!-- 标签列表 -->
    <div class="tag-list-section" v-loading="loading">
      <el-empty 
        v-if="tagList.length === 0 && !loading" 
        description="暂无标签，请先添加"
        :image-size="100"
      />
      <el-table v-else :data="tagList" stripe border>
        <el-table-column type="index" label="序号" width="80" align="center" />
        <el-table-column property="name" label="标签名称" min-width="200">
          <template #default="{ row }">
            <el-tag size="large" effect="plain">{{ row.name }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column property="id" label="标签ID" width="100" align="center" />
        <el-table-column label="操作" width="150" align="center" fixed="right">
          <template #default="{ row }">
            <el-button
              size="small"
              type="danger"
              @click="deleteTag(row)"
              :icon="Delete"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tag-manager {
  width: 100%;
}

.add-tag-section {
  display: flex;
  gap: 16px;
  align-items: center;
  margin-bottom: 20px;

  .tag-input {
    flex: 1;
  }
}

.tag-list-section {
  min-height: 200px;
}

:deep(.el-table) {
  font-size: 14px;
}
</style>