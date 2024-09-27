<script lang="ts" setup>
import { ref } from 'vue';
import { LewButton } from 'lew-ui'
import axios from 'axios';
import { LewMessage } from 'lew-ui';
import cc from 'clipboard';

// utils function

const splitAddress = (address: string) => {
  const lastIndex = address.lastIndexOf(':');
  const hostname = address.substring(0, lastIndex);
  const port = address.substring(lastIndex + 1);

  return {
    hostname, port
  }
}


console.log('尝试运行axios获取数据');

// 修改远端服务器地址;
const baseUrl = 'https://localhost:44316';
// const baseUrl = 'http://121.37.157.126:5000';

const instance = axios.create({
  baseURL: baseUrl,
  timeout: 3000,
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
    // .finally(function () {
    //   console.log('总是会执行');

    //   // 总是会执行
    // });

}



const addServerFunc = () => {
  // console.log('点击了addServerFunc');
  // alert('点击了addServerFunc');

  if (newAddress.value !== "") {

    let duServer = statusDataExample.value.find((server: any) => {
      return server.address === newAddress.value;
    })

    if (duServer !== undefined) {
      DuplicateErrorMessage(duServer.id)
      newAddress.value = "";
      return;
    }

    // const [hostname, port] = newAddress.value.split(':');
    const { hostname, port } = splitAddress(newAddress.value);

    console.log('hostname:', hostname);
    console.log('port:', port);


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

// 附加操作按钮函数

const DeleteServerInlineFunc = (id: number) => {
  if (id !== 0) {
    instance.delete(`/serverDelete/${id}`,)
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

// 连接服务器
// v1: 拷贝到剪切板
// v2: steam://rungame/730/76561202255233023/+connect%20bgp-north.tgpro.top:47045%20-perfectworld
const ConnectServerFunc = (addr: string) => {
  cc.copy(`connect ${addr}`)
}

// input value model

// add
let newAddress = ref('')
let addDesc = ref('默认服务器描述')

// delete
let deleteID = ref(0)


// table data model
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
  },
  {
    type: 'template',
    title: '执行',
    field: 'action',
    width: 150,
    align: 'center',
    fixed: 'right',
    x: 'center'
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

const DuplicateErrorMessage = (id: number) => {
  LewMessage.error({
    content: '服务器信息重复!',
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



// tag相关

// 查询标签
const queryAllTagsFunc = () => {
  instance.get('/serverList')
    .then(function (response) {
      // 处理成功情况
      // console.log(response);

      console.log('成功获取标签的数据', response.data);

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

const selectedPlatforms = ref([])
// 选中了哪些
// 显示的和值
const socialMediaOptions = ref([
  { label: '谷歌', value: 'google' },
  { label: '苹果', value: 'apple' },
  { label: '微软', value: 'microsoft' },
])

// const checkBoxValuePrint = () => {
//   console.log('当前选中的值', selectedPlatforms.value);
// }

const ttt = ref('hahaha')

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

  <!-- 标签区域 -->
  <div class="tag">
    标签信息
    <lew-button size="small" text="查询标签" type="text" @click.stop="checkBoxValuePrint" />

    <!-- lew-ui 自带一个tag的组件 -->
    <lew-flex direction="y" :gap="10">
      <lew-checkbox-group v-model="selectedPlatforms" size="small" :options="socialMediaOptions" />
    </lew-flex>

  </div>

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

      <template #action="{ row, column }">
        <lew-flex gap="0">
          <lew-button size="small" text="复制" type="text" @click.stop="ConnectServerFunc(row.address)" />
          <lew-popok title="删除确认" content="删除之后无法恢复，请确认！" placement="left" width="200px"
            @click.stop="DeleteServerInlineFunc(row.id)">
            <lew-button size="small" text="删除" type="text" />
          </lew-popok>
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
    <!-- <lew-input v-model="deleteID" size="medium" placeholder="输入id" clearable />
    <lew-button size="medium" :request="DeleteServerFunc" text="删除" type="ghost" /> -->
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