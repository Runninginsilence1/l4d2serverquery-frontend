<script lang="ts" setup>
import { ref } from 'vue';
import { LewButton } from 'lew-ui'
import axios from 'axios';
import { LewMessage } from 'lew-ui';
import cc from 'clipboard';
import myrequest from '@/utils/request';

const dialogVisible = ref(true);

const splitAddress = (address: string) => {
  const lastIndex = address.lastIndexOf(':');
  const hostname = address.substring(0, lastIndex);
  const port = address.substring(lastIndex + 1);

  return {
    hostname, port
  }
}

// 修改远端服务器地址;
// const baseUrl = 'https://localhost:44316';
const baseUrl = 'http://121.37.157.126:5000';

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
    });

}

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

// add
let rankNumber = ref('')
let addDesc = ref('默认服务器描述')

const DuplicateErrorMessage = (id: number) => {
  LewMessage.error({
    content: '服务器信息重复!',
    duration: 3000
  })
}

const apiFunc = () => {
  // console.log('点击了addServerFunc');
  // alert('点击了addServerFunc');

  if (rankNumber.value !== "") {

    let duServer = statusDataExample.value.find((server: any) => {
      return server.address === rankNumber.value;
    })

    if (duServer !== undefined) {
      DuplicateErrorMessage(duServer.id)
      rankNumber.value = "";
      return;
    }

    // const [hostname, port] = newAddress.value.split(':');
    const { hostname, port } = splitAddress(rankNumber.value);

    console.log('hostname:', hostname);
    console.log('port:', port);


    // 现在推测是因为前端这里的传递的参数没有带上那个谁

    // old:
    // myrequest.post('/servers/add', {
    //   host: hostname,
    //   port: port,
    //   desc: addDesc.value,
    // })
    myrequest.post('/servers/add', {
      addr: rankNumber.value,
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

</script>

<template>

<div class="op-area">
    <lew-input v-model="rankNumber" size="medium" placeholder="输入你的排名号?" clearable />
    <lew-button size="medium" :request="apiFunc" text="修改!" type="ghost" />

    
    
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