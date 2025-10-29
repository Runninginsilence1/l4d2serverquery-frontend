<script lang="ts" setup>
import {ref} from 'vue';
import { ElMessage } from 'element-plus'
import { Search, CopyDocument, User, Refresh, Delete, Warning, Select, PriceTag } from '@element-plus/icons-vue'
import axios from 'axios';
import cc from 'clipboard';
import myrequest from '@/utils/request';
import {useTagListStore} from '@/stores/counter';
import {ElDialog} from "element-plus";
import TagComponent from '@/components/TagComponent.vue'
import { getAllTags, bindTagsToServer, getServerTags } from '@/api/tag'


// Example data
// 提醒一句：chrome可以直接复制响应json中的数据成josn， 非常方便

const searchText = ref('')
const minPlayers = ref(0)
const maxPlayers = ref(0)
const useLocalSearch = ref(false) // 是否使用本地搜索
const originalServerList: any = ref([]) // 保存原始服务器列表，用于本地搜索

let statusDataExample: any = ref([
  // {
  //   "id": 24,
  //   "address": "106.54.61.52:25444",
  //   "serverName": "Fake Data",
  //   "map": "c8m5_rooftop",
  //   "onlinePlayers": 8,
  //   "maxPlayers": 12,
  //   "lastQueryTimeString": "2024-11-17 15:58:27"
  // }
])


const playerDialogVisible = ref(false)
const tagDialogVisible = ref(false)
const patchServerDialogVisible = ref(false)
const bindTagDialogVisible = ref(false)

const playersData: any = ref([])
const allTags: any = ref([])
const selectedTags: any = ref([])
const currentServerId = ref(0)
const currentServerName = ref('')


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


// 本地搜索函数
const localSearchFunc = () => {
  if (originalServerList.value.length === 0) {
    ElMessage.warning('请先进行后端查询以获取数据')
    return
  }
  
  // 在原始列表中进行过滤
  let filteredList = [...originalServerList.value]
  
  // 按服务器名称过滤
  if (searchText.value.trim()) {
    const keyword = searchText.value.toLowerCase()
    filteredList = filteredList.filter(server => 
      server.serverName?.toLowerCase().includes(keyword) || 
      server.address?.toLowerCase().includes(keyword)
    )
  }
  
  // 按玩家数量过滤
  if (minPlayers.value > 0) {
    filteredList = filteredList.filter(server => server.onlinePlayers >= minPlayers.value)
  }
  if (maxPlayers.value > 0) {
    filteredList = filteredList.filter(server => server.onlinePlayers <= maxPlayers.value)
  }
  
  statusDataExample.value = filteredList
  ElMessage.success(`本地搜索完成，找到 ${filteredList.length} 个服务器`)
}

// 带上了 tag 和玩家数量过滤
const queryServerFuncV2 = () => {
  // 如果勾选了本地搜索，则执行本地过滤
  if (useLocalSearch.value) {
    localSearchFunc()
    return
  }
  
  // 向给定ID的用户发起请求
  // instance.get('/serverList')

  const store = useTagListStore();

  // 构建请求参数
  const params: any = {
    name: searchText.value,
    tags: store.getTagList
  }
  
  // 只有当值大于0时才添加玩家数量过滤参数
  if (minPlayers.value > 0) {
    params.minPlayers = minPlayers.value
  }
  if (maxPlayers.value > 0) {
    params.maxPlayers = maxPlayers.value
  }

  myrequest.post('/serverList/v2', params)
      .then(function (response) {
        // console.log('成功获取服务器列表数据', response.data);

        const processedData = response.data.map(server => ({
          ...server,
          playerRatio: `${server.onlinePlayers}/${server.maxPlayers}`
        }))
        
        statusDataExample.value = processedData
        // 保存原始数据用于本地搜索
        originalServerList.value = processedData
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

          // 体现一种及时刷新的效果
          // id不一定是index, 这一点ai很快就帮我指正出来了


          
          let index = statusDataExample.value.findIndex((item) => item.id == id)

          if (index !== -1) {
statusDataExample.value.splice(index, 1);
          }

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

// 打开绑定标签对话框
const openBindTagDialog = async (id: number, serverName: string) => {
  currentServerId.value = id
  currentServerName.value = serverName
  
  try {
    // 获取所有标签
    const tagsRes = await getAllTags()
    allTags.value = tagsRes.data
    
    // 获取服务器已绑定的标签
    const serverTagsRes = await getServerTags(id)
    selectedTags.value = serverTagsRes.data.map((tag: any) => tag.id)
    
    bindTagDialogVisible.value = true
  } catch (error) {
    ElMessage.error('获取标签信息失败')
    console.error(error)
  }
}

// 保存标签绑定
const saveTagBinding = async () => {
  try {
    await bindTagsToServer(currentServerId.value, selectedTags.value)
    ElMessage.success('标签绑定成功')
    bindTagDialogVisible.value = false
    
    // 刷新服务器列表以显示更新后的标签
    queryServerFuncV2()
  } catch (error) {
    ElMessage.error('标签绑定失败')
    console.error(error)
  }
}

// 重置筛选条件
const resetFilters = () => {
  searchText.value = ''
  minPlayers.value = 0
  maxPlayers.value = 0
  useLocalSearch.value = false
  // 恢复原始列表
  if (originalServerList.value.length > 0) {
    statusDataExample.value = [...originalServerList.value]
  }
  ElMessage.info('已重置筛选条件')
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
      
      <div class="player-filter">
        <span class="filter-label">在线玩家数：</span>
        <el-input-number 
          v-model="minPlayers" 
          :min="0" 
          :max="32"
          size="large"
          placeholder="最小"
          class="player-input"
          controls-position="right"
        />
        <span class="filter-separator">-</span>
        <el-input-number 
          v-model="maxPlayers" 
          :min="0" 
          :max="32"
          size="large"
          placeholder="最大"
          class="player-input"
          controls-position="right"
        />
      </div>
      
      <el-checkbox 
        v-model="useLocalSearch" 
        size="large"
        class="local-search-checkbox"
      >
        本地搜索
      </el-checkbox>
      
      <el-button 
        type="primary" 
        size="large" 
        @click="queryServerFuncV2"
        :icon="Search"
      >
        {{ useLocalSearch ? '搜索' : '查询服务器' }}
      </el-button>
      
      <el-button 
        type="info" 
        size="large" 
        @click="resetFilters"
        plain
      >
        重置
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

    <el-dialog 
      v-model="bindTagDialogVisible" 
      :title="`🏷️ 绑定标签 - ${currentServerName}`" 
      width="600"
      append-to-body
      destroy-on-close
    >
      <div class="bind-tag-content">
        <el-alert
          title="提示"
          description="选择要绑定到此服务器的标签，可以多选"
          type="info"
          :closable="false"
          style="margin-bottom: 20px;"
        />
        
        <el-checkbox-group v-model="selectedTags" class="tag-checkbox-group">
          <el-checkbox 
            v-for="tag in allTags" 
            :key="tag.id" 
            :label="tag.id"
            :value="tag.id"
            border
            size="large"
          >
            {{ tag.name }}
          </el-checkbox>
        </el-checkbox-group>
        
        <el-empty 
          v-if="allTags.length === 0" 
          description="暂无可用标签，请先创建标签"
          :image-size="100"
        />
      </div>
      
      <template #footer>
        <el-button @click="bindTagDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveTagBinding" :icon="PriceTag">
          保存绑定
        </el-button>
      </template>
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
        
        <el-table-column label="标签" min-width="200">
          <template #default="{ row }">
            <div v-if="row.tags && row.tags.length > 0" class="tags-cell">
              <el-tag 
                v-for="tag in row.tags" 
                :key="tag.id"
                size="small"
                effect="plain"
                style="margin-right: 5px;"
              >
                {{ tag.name }}
              </el-tag>
            </div>
            <span v-else style="color: #909399;">暂无标签</span>
          </template>
        </el-table-column>
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

        <el-table-column label="操作" width="400" align="center" fixed="right">
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
                type="warning" 
                @click.stop="openBindTagDialog(row.id, row.serverName)"
                :icon="PriceTag"
              >
                标签
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
  flex-wrap: wrap;
  
  .search-input {
    flex: 1;
    min-width: 300px;
    max-width: 500px;
  }
  
  .player-filter {
    display: flex;
    align-items: center;
    gap: 8px;
    
    .filter-label {
      font-size: 14px;
      color: #606266;
      white-space: nowrap;
    }
    
    .filter-separator {
      font-size: 16px;
      color: #909399;
      font-weight: 500;
    }
    
    .player-input {
      width: 120px;
    }
  }
  
  .local-search-checkbox {
    :deep(.el-checkbox__label) {
      font-size: 14px;
      color: #606266;
    }
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

.bind-tag-content {
  min-height: 200px;
  
  .tag-checkbox-group {
    display: flex;
    flex-direction: column;
    gap: 12px;
    
    :deep(.el-checkbox) {
      margin: 0;
      padding: 10px 20px;
      width: 100%;
    }
  }
}

.tags-cell {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}
</style>