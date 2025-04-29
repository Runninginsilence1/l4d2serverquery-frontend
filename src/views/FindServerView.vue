<script lang="ts" setup>
import { ref } from 'vue';

// 在对话框里面的内容

// 列这一项需要一个具体的字段类型来表示

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

let a = JSON.stringify(exampleData[0])
console.log(a);

</script>

<template>
    <a-flex gap="middle" align="start" horizontal>
        <a-table :columns="column" :data-source="data.values.length === 0 ? exampleData : data.values" bordered>
            <template #bodyCell="{ column, record }">
                <template v-if="column.dataIndex === 'status'">
                    {{ record.player1 }} / {{ record.player2 }} Players
                </template>
            </template>
        </a-table>
    </a-flex>
</template>