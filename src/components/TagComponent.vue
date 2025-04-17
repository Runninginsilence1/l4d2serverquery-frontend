<script lang="ts" setup>
import { ref } from 'vue';
const tagList: any = ref([{
  name: "标签1",
}])

const foo = (id: any) => {

}
</script>

<template>
    <el-table :data="tagList">
      <el-table-column property="name" label="名称" width="200" />
      <template #action="{ row }">
        <lew-flex gap="0">
          <lew-button size="small" text="删除" type="text" @click.stop="foo(row.id)" />
        </lew-flex>
      </template>
    </el-table>
</template>