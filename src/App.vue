<script lang="ts" setup>
import { ref } from 'vue';
import { LewButton } from 'lew-ui'
import axios from 'axios';
import { LewMessage } from 'lew-ui';


console.log('尝试运行axios获取数据');

// 修改远端服务器地址;
// const baseUrl = 'https://localhost:44316';
const baseUrl = 'http://121.37.157.126:5000';

const instance = axios.create({
  baseURL: baseUrl,
  timeout: 1000,
  // headers: {'X-Custom-Header': 'foobar'}
});

let statusDataExample: any = ref([
  // {
  //   "address": "218.93.208.65:23361",
  //   "serverName": "[写专]夏洛克宿迁B1[4特40秒|灭0|路0%]00:16:40",
  //   "map": "c13m1_alpinecreek",
  //   "onlinePlayers": 0,
  //   "maxPlayers": 8
  // }
])

// api function definition
// query: 
// add: serverAdd

const queryServerFunc = () => {
  // 向给定ID的用户发起请求
  instance.get('/serverList')
    .then(function (response) {
      // 处理成功情况
      // console.log(response);

      console.log('成功获取服务器列表数据', response.data);

      statusDataExample.value = response.data;

      const updatedResponse = response.data.map(server => ({
        ...server,
        playerRatio: `${server.onlinePlayers}/${server.maxPlayers}`
      }));

      statusDataExample.value = updatedResponse
      queryMsgSuccess()

    })
    .catch(function (error) {
      // 处理错误情况
      queryErrorMessage()

      console.log(error);
    })
    .finally(function () {
      console.log('总是会执行');

      // 总是会执行
    });

}



const addServerFunc = () => {
  // console.log('点击了addServerFunc');
  // alert('点击了addServerFunc');

  if (newAddress.value !== "") {
    const [hostname, port] = newAddress.value.split(':');

    instance.post('/serverAdd', {
      host: hostname,
      port: port,
      desc: addDesc.value,
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

const DeleteServerFunc = () => {
  // console.log('点击了addServerFunc');
  // alert('点击了addServerFunc');

  if (deleteID.value !== 0) {
    instance.delete(`/serverDelete/${deleteID.value}`,)
      .then(function (response) {
        // 处理成功情况
        // statusDataExample.value = response.data;
        deleteSuccessMessage()
      })
      .catch(function (error) {
        deleteErrorMessage()
      });
  }
}


// input value model

// add
let newAddress = ref('')
let addDesc = ref('默认服务器描述')

// delete
let deleteID = ref(0)


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
  {
    title: '玩家数量',
    width: 150,
    field: 'playerRatio',
  }
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


// msg callback
const queryMsgSuccess = () => {
  LewMessage.success({
    content: '查询成功!',
    duration: 3000
  })
}

const queryErrorMessage = () => {
  LewMessage.error({
    content: '查询失败! 请查看控制台输出',
    duration: 3000
  })
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


const deleteSuccessMessage = () => {
  LewMessage.success({
    content: '删除成功!',
    duration: 3000
  })
}

const deleteErrorMessage = () => {
  LewMessage.error({
    content: '删除失败!',
    duration: 3000
  })
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

  <div class="add-area">
    <lew-button size="medium" :request="queryServerFunc" text="查询" type="ghost" />
  
  </div>


<div class="op-area">
  <lew-input v-model="newAddress" size="medium" placeholder="输入要添加的服务器地址" clearable />
    <lew-button size="medium" :request="addServerFunc" text="增加" type="ghost" />
    <lew-input v-model="deleteID" size="medium" placeholder="输入id" clearable />
    <lew-button size="medium" :request="DeleteServerFunc" text="删除" type="ghost" />
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