<script lang="ts" setup>
import TableView from './views/TableView.vue';
import AddServerView from './views/AddServerView.vue';
import TagView from './views/TagView.vue';
import { ref } from 'vue';
import { ElMessage } from 'element-plus'
import axios from 'axios';
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
  <div class="app-container">
    <div class="header-section">
      <h1 class="app-title">
        <el-icon style="vertical-align: middle; margin-right: 8px;"><Connection /></el-icon>
        L4D2 服务器查询系统
      </h1>
    </div>

    <div class="content-wrapper">
      <el-card class="section-card tag-section" shadow="hover">
        <template #header>
          <div class="card-header">
            <span class="card-title">
              <el-icon><Filter /></el-icon>
              筛选与管理
            </span>
          </div>
        </template>
        <TestView />
        <el-divider />
        <TagView />
      </el-card>

      <el-card class="section-card add-section" shadow="hover">
        <template #header>
          <div class="card-header">
            <span class="card-title">
              <el-icon><Plus /></el-icon>
              添加服务器
            </span>
          </div>
        </template>
        <AddServerView />
      </el-card>

      <el-card class="section-card table-section" shadow="hover">
        <template #header>
          <div class="card-header">
            <span class="card-title">
              <el-icon><List /></el-icon>
              服务器列表
            </span>
          </div>
        </template>
        <TableView />
      </el-card>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.app-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.header-section {
  text-align: center;
  margin-bottom: 30px;
  
  .app-title {
    color: white;
    font-size: 32px;
    font-weight: 700;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
    margin: 0;
    padding: 20px 0;
  }
}

.content-wrapper {
  max-width: 1600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.section-card {
  border-radius: 12px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
  }
  
  :deep(.el-card__header) {
    background: linear-gradient(to right, #f8f9fa, #e9ecef);
    border-bottom: 2px solid #dee2e6;
    padding: 16px 20px;
  }
  
  :deep(.el-card__body) {
    padding: 24px;
  }
}

.card-header {
  display: flex;
  align-items: center;
  
  .card-title {
    font-size: 18px;
    font-weight: 600;
    color: #495057;
    display: flex;
    align-items: center;
    gap: 8px;
    
    .el-icon {
      font-size: 20px;
    }
  }
}

.tag-section {
  background: white;
}

.add-section {
  background: white;
}

.table-section {
  background: white;
}

@media (max-width: 768px) {
  .app-container {
    padding: 10px;
  }
  
  .header-section .app-title {
    font-size: 24px;
  }
  
  .section-card :deep(.el-card__body) {
    padding: 16px;
  }
}
</style>