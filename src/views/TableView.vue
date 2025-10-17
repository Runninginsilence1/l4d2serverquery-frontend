<script lang="ts" setup>
import {ref} from 'vue';
import { ElMessage } from 'element-plus'
import { Search, CopyDocument, User, Refresh, Delete, Warning, Select } from '@element-plus/icons-vue'
import axios from 'axios';
import cc from 'clipboard';
import myrequest from '@/utils/request';
import {useTagListStore} from '@/stores/counter';
import {ElDialog} from "element-plus";
import TagComponent from '@/components/TagComponent.vue'


// Example data
// 提醒一句：chrome可以直接复制响应json中的数据成josn， 非常方便

const searchText = ref('')

let statusDataExample: any = ref([
  {
    "id": 24,
    "address": "106.54.61.52:25444",
    "serverName": "Fake Data",
    "map": "c8m5_rooftop",
    "onlinePlayers": 8,
    "maxPlayers": 12,
    "lastQueryTimeString": "2024-11-17 15:58:27"
  }
])


const playerDialogVisible = ref(false)
const tagDialogVisible = ref(false)
const patchServerDialogVisible = ref(false)

const playersData: any = ref([])


const QueryPlayerFunc = (id: number, addr: string) => {
  myrequest.post("/players/query", {
    addr: addr
  }).then((res) => {
    playersData.value = res.data;
    playerDialogVisible.value = true;
  }).catch(function (error) {
    ElMessage.error('查询失败! 请查看控制台输出')
    console.error(error.response.data)
  })
}


const RefreshServerFunc = (id: number) => {
  myrequest.get(`/singleServer/${id}`).then((res) => {
    console.log(res.data);
    let index = statusDataExample.value.findIndex((item) => item.id == id)
    res.data.playerRatio = `${res.data.onlinePlayers}/${res.data.maxPlayers}`
    statusDataExample.value[index] = res.data;
  }).catch(function (error) {
    ElMessage.error('访问接口失败!')
    console.log('访问接口失败');
    console.log(error);
  })
}

const PatchServerFunc = (id: number) => {
  playerDialogVisible.value = true;
}


// 带上了 tag
const queryServerFuncV2 = () => {
  // 向给定ID的用户发起请求
  // instance.get('/serverList')

  const store = useTagListStore();

  myrequest.post('/serverList/v2', {
    name: searchText.value,
    tags: store.getTagList
  })
      .then(function (response) {
        // console.log('成功获取服务器列表数据', response.data);

        statusDataExample.value = response.data.map(server => ({
          ...server,
          playerRatio: `${server.onlinePlayers}/${server.maxPlayers}`
        }))
        queryMsgSuccess()

      })
      .catch(function (error) {
        queryErrorMessage()
        // console.error(error.response);
        console.error(error);
      })

}

// msg callback
const queryMsgSuccess = () => {
  ElMessage.success('查询成功!')
}

const queryErrorMessage = () => {
  ElMessage.error('查询失败! 请查看控制台输出')
}


const statusColumns = [
  // {
  //title: 'ID',
  // field: 'id',
  // width: 60,
  // x: 'center'
  // },
  {
    title: '服务器地址',
    width: 150,
    field: 'address',
  },
  {
    title: '服务器名称',
    width: 150,
    field: 'serverName',
  },
  {
    title: '当前地图',
    width: 150,
    field: 'map',
  },
  {
    title: '玩家数量',
    width: 150,
    field: 'playerRatio',
  },

  // 定制插槽
  {
    title: '最后复制时间',
    width: 150,
    field: 'lastQueryTimeString',
  },
  // 最后5分钟如果复制过则警告，yellow
  {
    title: '状态',
    width: 150,
    field: 'status',
  },
  {
    type: 'template',
    title: '执行',
    field: 'action',
    width: 250,
  }
]


const statusRender = (timeStr: string): boolean => {
  // 解析字符串时间
  const time = new Date(timeStr);

  // 获取当前时间
  const now = new Date();

  // 计算时间差（以毫秒为单位）
  const timeDiff = now.getTime() - time.getTime();

  // 将时间差转换为分钟
  const timeDiffInMinutes = timeDiff / (1000 * 60);

  // 判断时间差是否在5分钟以内
  return timeDiffInMinutes <= 5;
}


function getCurrentTimeFormatted(): string {
  const now = new Date();
  return now.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false // 24小时制
  }).replace(/\//g, '-').replace(',', '');
}


const ConnectServerFunc = (id: number, addr: string) => {
  cc.copy(`connect ${addr}`)
  myrequest.get(`/lastCopyTimeUpdate/${id}`)
      .then(function () {
        ElMessage.success('连接指令已复制! 更新服务器时间成功!')
      })
      .catch(function (error) {
        ElMessage.error('更新服务器时间失败!')
        console.log('更新服务器时间失败');
        console.log(error);
      })
  let index = statusDataExample.value.findIndex((item) => item.id == id)
  statusDataExample.value[index].lastQueryTimeString = getCurrentTimeFormatted()
}

const DeleteServerInlineFunc = (id: number) => {
  if (id !== 0) {
    myrequest.delete(`/serverDelete/${id}`,)
        .then(function () {
          // 处理成功情况
          // statusDataExample.value = response.data;
          deleteSuccessMessage()
        })
        .catch(function () {
          deleteErrorMessage()
        });
  }
}

const deleteSuccessMessage = () => {
  ElMessage.success('删除成功!')
}

const deleteErrorMessage = () => {
  ElMessage.error('删除失败!')
}


const popokCancel = () => {
}



</script>

<template>
  <div class="table-view-container">
    <div class="search-section">
      <el-input 
        v-model="searchText" 
        placeholder="搜索服务器关键字..." 
        size="large"
        :prefix-icon="Search"
        clearable
        class="search-input"
      />
      <el-button 
        type="primary" 
        size="large" 
        @click="queryServerFuncV2"
        :icon="Search"
      >
        查询服务器
      </el-button>
    </div>

    <el-dialog 
      v-model="tagDialogVisible" 
      title="🏷️ 标签管理" 
      width="800"
      append-to-body
      destroy-on-close
    >
      <TagComponent/>
    </el-dialog>

    <el-dialog 
      v-model="playerDialogVisible" 
      title="👥 玩家信息" 
      width="800"
      append-to-body
      destroy-on-close
    >
      <el-table :data="playersData" stripe>
        <el-table-column property="name" label="玩家名称" min-width="200"/>
      </el-table>
    </el-dialog>

    <div class="table-area">
      <el-table 
        :data="statusDataExample" 
        stripe 
        border
        style="width: 100%"
        :header-cell-style="{background: '#f5f7fa', color: '#606266'}"
      >
        <el-table-column property="address" label="服务器地址" min-width="180" />
        <el-table-column property="serverName" label="服务器名称" min-width="200" show-overflow-tooltip />
        <el-table-column property="map" label="当前地图" min-width="150" />
        <el-table-column property="playerRatio" label="玩家数量" width="120" align="center" />
        <el-table-column property="lastQueryTimeString" label="最后复制时间" min-width="180" />
        
        <el-table-column label="状态" width="150" align="center">
          <template #default="{ row }">
            <el-tag 
              v-if="statusRender(row.lastQueryTimeString)" 
              type="warning"
              effect="dark"
            >
              <el-icon style="vertical-align: middle;"><Warning /></el-icon>
              5分钟内已连
            </el-tag>
            <el-tag v-else type="success" effect="dark">
              <el-icon style="vertical-align: middle;"><Select /></el-icon>
              推荐连接
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="320" align="center" fixed="right">
          <template #default="{ row }">
            <el-space wrap>
              <el-button 
                size="small" 
                type="primary" 
                @click.stop="ConnectServerFunc(row.id, row.address)"
                :icon="CopyDocument"
              >
                复制
              </el-button>
              <el-button 
                size="small" 
                type="info" 
                @click.stop="QueryPlayerFunc(row.id, row.address)"
                :icon="User"
              >
                玩家
              </el-button>
              <el-button 
                size="small" 
                type="success" 
                @click.stop="RefreshServerFunc(row.id)"
                :icon="Refresh"
              >
                刷新
              </el-button>
              <el-button 
                size="small" 
                type="danger" 
                @click.stop="DeleteServerInlineFunc(row.id)"
                :icon="Delete"
              >
                删除
              </el-button>
            </el-space>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.table-view-container {
  width: 100%;
}

.search-section {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
  align-items: center;
  
  .search-input {
    flex: 1;
    max-width: 500px;
  }
}

.table-area {
  width: 100%;
  
  :deep(.el-table) {
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  }
  
  :deep(.el-table th) {
    font-weight: 600;
  }
  
  :deep(.el-button + .el-button) {
    margin-left: 0;
  }
}

:deep(.el-dialog) {
  border-radius: 12px;
}

:deep(.el-dialog__header) {
  background: linear-gradient(to right, #f8f9fa, #e9ecef);
  border-bottom: 2px solid #dee2e6;
  padding: 16px 20px;
}
</style>