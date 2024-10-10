<script lang="ts" setup>
import {ref} from 'vue';
import {LewButton, LewMessage} from 'lew-ui'
import axios from 'axios';
import cc from 'clipboard';
import myrequest from '@/utils/request';
import { useTagListStore } from '@/stores/counter';

const splitAddress = (address: string) => {
  const lastIndex = address.lastIndexOf(':');
  const hostname = address.substring(0, lastIndex);
  const port = address.substring(lastIndex + 1);

  return {
    hostname, port
  }
}

let statusDataExample: any = ref([
  
])

const queryServerFunc = () => {
  // 向给定ID的用户发起请求
  // instance.get('/serverList')
  myrequest.get('/serverList')
    .then(function (response) {
      // 处理成功情况
      // console.log(response);

      console.log('成功获取服务器列表数据', response.data);

      statusDataExample.value = response.data;

      statusDataExample.value = response.data.map(server => ({
        ...server,
        playerRatio: `${server.onlinePlayers}/${server.maxPlayers}`
      }))
      queryMsgSuccess()

    })
    .catch(function (error) {
      // 处理错误情况
      console.log('调用查询接口失败');
      console.log(error);      
      queryErrorMessage()
    })

}

// 带上了 tag
const queryServerFuncV2 = () => {
  // 向给定ID的用户发起请求
  // instance.get('/serverList')

  const store = useTagListStore();

  myrequest.post('/serverList/v2', {
    tags: store.getTagList
  })
    .then(function (response) {
      // 处理成功情况
      // console.log(response);

      console.log('成功获取服务器列表数据', response.data);

      statusDataExample.value = response.data;

      statusDataExample.value = response.data.map(server => ({
        ...server,
        playerRatio: `${server.onlinePlayers}/${server.maxPlayers}`
      }))
      queryMsgSuccess()

    })
    .catch(function (error) {
      // 处理错误情况
      console.log('调用查询接口失败');
      console.log(error);      
      queryErrorMessage()
    })

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
    title: '最后复制时间',
    width: 150,
    field: 'lastQueryTimeString',
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

const ConnectServerFunc = (id: number,addr: string) => {
  cc.copy(`connect ${addr}`)
  myrequest.get(`/lastCopyTimeUpdate/${id}`)
    .then(function (response) {
    LewMessage.success({
    content: '更新服务器时间成功!',
    duration: 3000
  })
    })
    .catch(function (error) {
      LewMessage.error({
    content: '访问接口失败!',
    duration: 3000
  })
  console.log('访问接口失败');
      console.log(error);
    })
}

const DeleteServerInlineFunc = (id: number) => {
  if (id !== 0) {
    myrequest.delete(`/serverDelete/${id}`,)
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


</script>

<template>

<div class="add-area">
    <lew-button size="medium" :request="queryServerFuncV2" text="查询" type="ghost" />
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
          <lew-button size="small" text="复制" type="text" @click.stop="ConnectServerFunc(row.id, row.address)" />
          <lew-popok title="删除确认" content="删除之后无法恢复，请确认！" placement="left" width="200px"
            @click.stop="DeleteServerInlineFunc(row.id)">
            <lew-button size="small" text="删除" type="text" />
          </lew-popok>
        </lew-flex>
      </template>
    </lew-table>
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