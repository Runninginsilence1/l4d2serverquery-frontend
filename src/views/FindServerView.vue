<script lang="ts" setup>
import {ref} from 'vue';
import myrequest from '@/utils/request';
import { ElMessage } from 'element-plus';

const showSearchHint = ref(true);

const column = [
  {
    name: "地址",
    dataIndex: "addr",
  },
  {
    name: "名称",
    dataIndex: "name",
  },
  {
    name: "玩家状态",
    dataIndex: "status",
  },
  {
    name: "当前地图",
    dataIndex: "map",
  },
  {
    name: "操作",
    dataIndex: "action",
  },
]

const exampleData = [
  {
    addr: "192.168.1.100:27015",
    name: "服务器1",
    status: "1 / 16 Players",
    map: "de_dust2",
    player1: 5,
    player2: 6,
  },
  {
    addr: "192.168.1.100:27015",
    name: "服务器1",
    status: "1 / 16 Players",
    player1: 5,
    player2: 6,
    map: "de_dust2",
  },
]

const data = ref([])

const serverName = ref("");

const loading = ref(false); // 搜索加载框
const searchButton = () => {
  loading.value = true;
  showSearchHint.value = false;
  myrequest.get(`/master_query?serverName=${serverName.value}&page_size=100`)
      .then(function (res) {
        console.log('打印获取的服务器列表')
        console.log(res.data)

        let columnData = res.data.map(item => {
          return {
            player1: item.currentPlayers,
            player2: item.maxPlayers,
            map: item.map,
            name: item.name,
            addr: `${item.ipAddress}:${item.port}`,
          }
        })

        console.log('转换后的数据')
        console.log(columnData)

        data.value = columnData;

        ElMessage.success("搜索成功")
      })
      .catch(function (error) {
        console.error(error)
      });

  loading.value = false;
}

const addButton = (addr: string) => {

  myrequest.get(`/serverAddByMasterQuery?addr=${addr}`)
      .then(function (res) {
        ElMessage.success("添加成功")
      })
      .catch(function (error) {
        ElMessage.error("添加失败")
      });
}
</script>

<template>
  <div class="find-server-container">
    <a-flex gap="middle" align="start" horizontal class="search-bar">
      <a-input 
        v-model:value="serverName" 
        placeholder="请输入服务器名称" 
        @pressEnter="searchButton"
        size="large"
      />
      <a-button type="primary" @click="searchButton" size="large">搜索</a-button>
      <a-spin :spinning="loading"/>
    </a-flex>

    <div v-if="showSearchHint" class="hint-container">
      <div class="search-prompt-box">
        <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>

        <div class="title">
          请先进行搜索
        </div>
        <div class="message">
          输入您感兴趣的服务器关键词，系统将为您提供相关信息。
        </div>
      </div>
    </div>
    
    <div v-else class="table-container">
      <a-table 
        :columns="column" 
        :data-source="data" 
        bordered
        :pagination="{ pageSize: 10, showSizeChanger: true, showTotal: total => `共 ${total} 条` }"
        :scroll="{ y: 400 }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'status'">
            {{ record.player1 }} / {{ record.player2 }} Players
          </template>
          <template v-if="column.dataIndex === 'action'">
            <a-button type="primary" @click="addButton(record.addr)">单独添加</a-button>
          </template>
        </template>
      </a-table>
    </div>
  </div>
</template>

<style lang="css" scoped>
.find-server-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.search-bar {
  width: 100%;
  padding-bottom: 10px;
  border-bottom: 1px solid #f0f0f0;
}

.hint-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}

.search-prompt-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 50px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
  text-align: center;
  max-width: 450px;
  animation: fadeIn 0.5s ease-in-out;
}

.icon {
  font-size: 48px;
  color: #ffffff;
  margin-bottom: 20px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.title {
  font-size: 26px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 12px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.message {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.8;
}

.table-container {
  width: 100%;
  overflow: hidden;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>