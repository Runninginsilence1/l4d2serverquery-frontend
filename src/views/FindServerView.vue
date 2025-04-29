<script lang="ts" setup>
import {ref} from 'vue';
import myrequest from '@/utils/request';
import {LewMessage} from "lew-ui";

// 在对话框里面的内容

// 列这一项需要一个具体的字段类型来表示

const loading = ref(false);

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

const data = ref([]);

data.value = [{
  addr: "192.168.1.100:27015",
  name: "服务器2",
  status: "1 / 16 Players",
  player1: 5,
  player2: 6,
  map: "de_dust2",
},]

const serverName = ref("");

const searchButton = () => {
  loading.value = true;
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
  <a-spin v-if="loading" />
  <a-flex gap="middle" align="start" vertical>
    <a-flex gap="middle" align="start" horizontal>
    <a-input v-model:value="serverName" placeholder="请输入服务器名称" />
    <a-button type="primary" @click="searchButton">搜索</a-button>
    </a-flex>

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
  </a-flex>
</template>