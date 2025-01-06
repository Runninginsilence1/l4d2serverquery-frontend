<script lang="ts" setup>
import {ref} from 'vue';
import {LewButton, LewMessage} from 'lew-ui'
import axios from 'axios';
import cc from 'clipboard';
import myrequest from '@/utils/request';
import {useTagListStore} from '@/stores/counter';
import {ElDialog} from "element-plus";

const splitAddress = (address: string) => {
  const lastIndex = address.lastIndexOf(':');
  const hostname = address.substring(0, lastIndex);
  const port = address.substring(lastIndex + 1);

  return {
    hostname, port
  }
}

// Example data
// 提醒一句：chrome可以直接复制响应json中的数据成josn， 非常方便

let statusDataExample: any = ref([
{
    "id": 24,
    "address": "106.54.61.52:25444",
    "serverName": "Fake Data",
    "map": "c8m5_rooftop",
    "onlinePlayers": 8,
    "maxPlayers": 12,
    "lastQueryTimeString": "2024-11-17 15:58:27"
}
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

const dialogVisible = ref(false)

const playersData: any = ref([])




const QueryPlayerFunc = (id: number, addr: string) => {
  myrequest.post("/players/query", {
    addr: addr
  }).then((res) => {
    playersData.value = res.data;

    dialogVisible.value = true;
  }).catch(function (error) {
    LewMessage.error({
      content: '访问接口失败!',
      duration: 3000
    })
    console.log('访问接口失败');
    console.log(error);
  })
}



const RefreshServerFunc = (id: number) => {
  myrequest.get(`/singleServer/${id}`).then((res) => {
    console.log(res.data);
    let index = statusDataExample.value.findIndex((item) => item.id == id)
    res.data.playerRatio = `${res.data.onlinePlayers}/${res.data.maxPlayers}`
    statusDataExample.value[index] = res.data;
  }).catch(function (error) {
    LewMessage.error({
      content: '访问接口失败!',
      duration: 3000
    })
    console.log('访问接口失败');
    console.log(error);
  })
}

const TestIndexFunc = (row: any, column: any) => {
  let index = statusDataExample.value.findIndex((item) => item.id == row.id)
  console.log(`id: ${row.id}, index: ${index}`)
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


const statusRender = (timeStr: string): boolean =>  {
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

function formatTimeInterval(timeStr: string): string {
    // 解析时间字符串为Date对象
    const pastTime = new Date(timeStr);
    // 获取当前时间
    const now = new Date();
    // 计算时间差（以毫秒为单位）
    const timeDiff = now.getTime() - pastTime.getTime();

    // 计算天、小时、分钟和秒
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    // 根据时间差返回不同的字符串
    if (days > 0) {
        return `距离上次复制 ${days}天`;
    } else if (hours > 0) {
        return `距离上次复制 ${hours}小时`;
    } else if (minutes > 0) {
        return `距离上次复制 ${minutes}分钟`;
    } else {
        return `距离上次复制 ${seconds}秒`;
    }
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
      let index = statusDataExample.value.findIndex((item) => item.id == id)
      statusDataExample.value[index].lastQueryTimeString = getCurrentTimeFormatted()
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

const popokOk = () => {

}

const popokCancel = () => {
}


</script>

<template>

  <div class="add-area">
    <lew-button size="medium" :request="queryServerFuncV2" text="查询" type="ghost"/>
  </div>

  <el-dialog v-model="dialogVisible" title="玩家详情" width="800">
    <el-table :data="playersData">
      <el-table-column property="id" label="ID" width="150"/>
      <el-table-column property="name" label="名称" width="200"/>
      <el-table-column property="score" label="分数" width="200"/>
      <el-table-column property="seconds" label="游戏时间" width="200"/>
    </el-table>
  </el-dialog>

  <div class="table-area" style="height: 680px">
    <lew-table :data-source="statusDataExample" :columns="statusColumns">

      <template #status="{ row, column }">
        <lew-flex gap="0">
          <!-- 判断是否 -->
          <lew-tag v-if="statusRender(row.lastQueryTimeString)" type="fill" color="yellow">距离上次连接不足5分钟</lew-tag>
          <lew-tag v-else type="fill" color="green">推荐连接</lew-tag>
        </lew-flex>
      </template>      

      <template #action="{ row, column }">
        <lew-flex gap="0">
          <!-- 不知道为什么在这里把删除调用了两次 -->
          <lew-button size="small" text="复制" type="text" @click.stop="ConnectServerFunc(row.id, row.address)"/>
          <lew-button size="small" text="玩家" type="text" @click.stop="QueryPlayerFunc(row.id, row.address)"/>
          <lew-button size="small" text="刷新" type="text" @click.stop="RefreshServerFunc(row.id)"/>
          <lew-button size="small" text="删除" type="text" @click.stop="DeleteServerInlineFunc(row.id)"/>
        </lew-flex>
      </template>
    </lew-table>
  </div>

</template>

<style lang="scss" scoped>
.table-area {
  //border: red 5px solid;
}
</style>