<script lang="ts" setup>
import { ref } from 'vue';
import { LewButton } from 'lew-ui'
import axios from 'axios';
import { LewMessage } from 'lew-ui';


console.log('尝试运行axios获取数据');

// const axios = require('axios')


let statusDataExample: any = ref([
  {
    "address": "60.204.244.191:27015",
    "serverName": "萌新聚集地 #1 [ZoneMod v2.8.9d Revamped]",
    "map": "c5m5_bridge",
    "onlinePlayers": 9,
    "maxPlayers": 30
  },
  {
    "address": "8.138.80.21:10052",
    "serverName": "HN 2服 - NepSV Average",
    "map": "c2m1_highway",
    "onlinePlayers": 4,
    "maxPlayers": 12
  },
  // {
  //     "address": "218.93.208.65:23361",
  //     "serverName": "[写专]夏洛克宿迁B1[4特40秒|灭0|路0%]00:16:40",
  //     "map": "c13m1_alpinecreek",
  //     "onlinePlayers": 0,
  //     "maxPlayers": 8
  // }
])


let newAddress = ref('')


const statusColumns = [
  {
    title: 'ID',
    field: 'id',
    width: 60,
    x: 'center'
  },
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
]

// const columns = [
//   {
//     title: 'ID',
//     field: 'id',
//     width: 60,
//     x: 'center'
//   },
//   {
//     title: '产品信息',
//     width: 150,
//     field: 'info'
//   },
//   {
//     title: '发布年份',
//     field: 'releaseYear',
//     width: 120,
//     x: 'center',
//     customRender: ({ row }: any) => {
//       return row.releaseYear
//     }
//   },
//   {
//     title: '类别',
//     field: 'category',
//     width: 120,
//     x: 'center'
//   },
//   {
//     title: '评分',
//     width: 120,
//     field: 'rating',
//     x: 'center'
//   },
//   {
//     title: '简介',
//     width: 480,
//     type: 'text-trim',
//     field: 'intro'
//   }
// ]

const getStatusFunc = () => {
  // 向给定ID的用户发起请求
  axios.get('https://localhost:44316/serverList')
    .then(function (response) {
      // 处理成功情况
      console.log('ok');

      console.log(response);

      statusDataExample.value = response.data;
    })
    .catch(function (error) {
      // 处理错误情况
      console.log('not ok');

      console.log(error);
    })
    .finally(function () {
      console.log('总是会执行');

      // 总是会执行
    });


}

const showSuccessMessage = () => {
  LewMessage.success({
    content: '添加成功!',
    duration: 3000
  })
}

const showErrorMessage = () => {
  LewMessage.error({
    content: '添加失败!',
    duration: 3000
  })
}


const addServerFunc = () => {
  // console.log('点击了addServerFunc');
  // alert('点击了addServerFunc');

  if (newAddress.value !== "") {
    axios.post('https://localhost:44316/serverAdd', {
    host: "8.138.80.21",
    port: 10052,
    desc: "默认描述"
})
      .then(function (response) {
        // 处理成功情况
        // statusDataExample.value = response.data;
        showSuccessMessage()
      })
      .catch(function (error) {
        showErrorMessage()
      });
  }
}


</script>

<template>
  <!-- <div style="height: 380px">
    <lew-table :data-source="data" :columns="columns">
      <template #info="{ row }">
        <lew-flex direction="y" x="start" gap="0px" class="info">
          <div class="name">{{ row.name }}</div>
          <div class="brand">{{ row.brand }}</div>
        </lew-flex>
      </template>
<template #rating="{ row }">
        <lew-flex>
          <lew-badge v-if="row.rating >= 90" round color="green" />
          <lew-badge v-else-if="row.rating >= 80" round color="blue" />
          <lew-badge v-else round color="orange" />
          <span>{{ row.rating >= 90 ? '优秀' : row.rating >= 80 ? '良好' : '一般' }}</span>
        </lew-flex>
      </template>
</lew-table>
</div> -->

  <div style="height: 380px">
    <lew-table :data-source="statusDataExample" :columns="statusColumns">
      <template #info="{ row }">
        <lew-flex direction="y" x="start" gap="0px" class="info">
          <div class="name">{{ row.name }}</div>
          <div class="brand">{{ row.brand }}</div>
        </lew-flex>
      </template>
      <template #rating="{ row }">
        <lew-flex>
          <lew-badge v-if="row.rating >= 90" round color="green" />
          <lew-badge v-else-if="row.rating >= 80" round color="blue" />
          <lew-badge v-else round color="orange" />
          <span>{{ row.rating >= 90 ? '优秀' : row.rating >= 80 ? '良好' : '一般' }}</span>
        </lew-flex>
      </template>
    </lew-table>
  </div>

  <div>
    <lew-button size="medium" :request="getStatusFunc" text="查询" type="ghost" />
    <lew-input v-model="newAddress" size="medium" placeholder="输入要添加的服务器地址" clearable />
    <lew-button size="medium" :request="addServerFunc" text="增加" type="ghost" />
  </div>


</template>

<style lang="scss" scoped>
.info {
  line-height: 22px;

  .name {
    font-weight: bold;
  }

  .brand {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 12px;
    white-space: nowrap;
    color: var(--lew-text-color-7);
  }
}
</style>