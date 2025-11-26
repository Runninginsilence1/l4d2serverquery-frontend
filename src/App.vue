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
  /* background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); REMOVED for retro theme */
  padding: 20px;
  position: relative;
  z-index: 1;
}

.header-section {
  text-align: center;
  margin-bottom: 30px;
  
  .app-title {
    color: var(--retro-text-main); /* Updated color */
    font-family: var(--retro-font-tech); /* Updated font */
    font-size: 42px; /* Larger for retro feel */
    font-weight: 700;
    text-shadow: var(--retro-glow); /* Added glow */
    margin: 0;
    padding: 20px 0;
    text-transform: uppercase;
    letter-spacing: 4px;
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
  /* Styles moved to global overrides in retro.css for consistency */
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 0 15px rgba(255, 176, 0, 0.3) !important;
  }
  
  /* Removed deep selectors that conflict with retro.css */
}

.card-header {
  display: flex;
  align-items: center;
  
  .card-title {
    font-size: 20px;
    font-weight: 600;
    color: var(--retro-text-main);
    display: flex;
    align-items: center;
    gap: 12px;
    font-family: var(--retro-font-tech);
    text-transform: uppercase;
    
    .el-icon {
      font-size: 24px;
      color: var(--retro-primary);
    }
  }
}

/* Removed specific section background colors to let global card styles take over */
.tag-section,
.add-section,
.table-section {
  background: transparent;
}

@media (max-width: 768px) {
  .app-container {
    padding: 10px;
  }
  
  .header-section .app-title {
    font-size: 28px;
  }
  
  /* Removed padding override as it might conflict with global styles, can re-add if needed */
}
</style>