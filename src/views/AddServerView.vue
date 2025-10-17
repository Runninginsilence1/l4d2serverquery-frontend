<script lang="ts" setup>
import { ref } from 'vue';
import { ElMessage } from 'element-plus'
import { Plus, Connection } from '@element-plus/icons-vue'
import axios from 'axios';
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
      console.log('成功获取服务器列表数据', response.data);
      statusDataExample.value = response;
      const updatedResponse = response.data.map(server => ({
        ...server,
        playerRatio: `${server.onlinePlayers}/${server.maxPlayers}`
      }));
      statusDataExample.value = updatedResponse
      queryMsgSuccess()
    })
    .catch(function (error) {
      queryErrorMessage();
      console.log(error);
    });
}

// msg callback
const queryMsgSuccess = () => {
  ElMessage.success('查询成功!')
}

const queryErrorMessage = () => {
  ElMessage.error('查询失败! 请查看控制台输出')
}

const showSuccessMessage = () => {
  ElMessage.success('添加成功!')
}

const showErrorMessage = () => {
  ElMessage.error('添加失败!')
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
  ElMessage.success('删除成功!')
}

const deleteErrorMessage = () => {
  ElMessage.error('删除失败!')
}

// add
let newAddress = ref('')
let addDesc = ref('默认服务器描述')

const DuplicateErrorMessage = (id: number) => {
  ElMessage.error('服务器信息重复!')
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


    // 现在推测是因为前端这里的传递的参数没有带上那个谁

    // old:
    // myrequest.post('/servers/add', {
    //   host: hostname,
    //   port: port,
    //   desc: addDesc.value,
    // })
    myrequest.post('/servers/add', {
      addr: newAddress.value,
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

import type { UploadFileItem } from 'lew-ui'
import uploadhelper from '@/utils/uploadhelper';
import { watch } from 'vue';

const fileList = ref<UploadFileItem[]>([])

watch(fileList, (newVal, oldVal) => {
  console.log('fileList changed:', newVal, oldVal);
})

</script>

<template>
  <div class="add-server-container">
    <div class="input-group">
      <el-input 
        v-model="newAddress" 
        size="large" 
        placeholder="输入服务器地址 (例如: 192.168.1.1:27015)" 
        clearable
        class="server-input"
      >
        <template #prefix>
          <el-icon><Connection /></el-icon>
        </template>
      </el-input>
      <el-button 
        size="large" 
        type="primary" 
        @click="addServerFunc"
        :icon="Plus"
        class="add-button"
      >
        添加服务器
      </el-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.add-server-container {
  width: 100%;
}

.input-group {
  display: flex;
  gap: 16px;
  align-items: center;
  width: 100%;
  
  .server-input {
    flex: 3; // 输入框占3份
  }
  
  .add-button {
    flex-shrink: 0; // 按钮不缩小
    min-width: 140px;
  }
}

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
    color: #999;
  }
}
</style>