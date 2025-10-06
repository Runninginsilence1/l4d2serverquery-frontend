<script lang="ts" setup>
import {ref} from 'vue';
import myrequest from '@/utils/request';
import {LewMessage} from "lew-ui";

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

        LewMessage.success("搜索成功")
      })
      .catch(function (error) {
        console.error(error)
      });

  loading.value = false;
}

const addButton = (addr: string) => {

  myrequest.get(`/serverAddByMasterQuery?addr=${addr}`)
      .then(function (res) {
        LewMessage.success("添加成功")
      })
      .catch(function (error) {
        LewMessage.error("添加失败")
      });
}
</script>

<template>
  <a-flex gap="middle" align="start" vertical>
    <a-flex gap="middle" align="start" horizontal>
    <a-input v-model:value="serverName" placeholder="请输入服务器名称" @pressEnter="searchButton" />
    <a-button type="primary" @click="searchButton">搜索</a-button>
      <a-spin :spinning="loading"/>
    </a-flex>

    <div v-if="showSearchHint">
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
    <div v-else>
      <a-table :columns="column" :data-source="data" bordered>
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'status'">
            {{ record.player1 }} / {{ record.player2 }} Players
          </template>
          <template v-if="column.dataIndex === 'action'">
        <span>
          <a-button @click="addButton(record.addr)">单独添加</a-button>
        </span>
          </template>
        </template>
      </a-table>
    </div>
  </a-flex>
</template>

<style lang="css" scoped>
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
  background-color: #f4f7f9;
}

.search-prompt-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px 40px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 400px;
  animation: fadeIn 0.5s ease-in-out;
}

.icon {
  font-size: 48px;
  color: #5a7d9b;
  margin-bottom: 20px;
}

.title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
}

.message {
  font-size: 16px;
  color: #666;
  line-height: 1.6;
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