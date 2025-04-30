<script setup>
import {LewButton, LewInput} from "lew-ui";
import {ref} from "vue";

// 组件传参
const props = defineProps(['oldAddress'])

console.log(props.foo)

const newAddress = ref("")
const newRank = ref("")

</script>

<template>
<a-flex>
  <a-flex :gap="15" horizonal>
    <span>玩家依据:</span>
    <lew-input v-model="newAddress" size="medium" placeholder="新的IP地址" clearable />
    <span>服务器地址:</span>
    <lew-input v-model="newAddress" size="medium" placeholder="输入要添加的服务器地址" clearable />
    <lew-button size="medium" :request="addServerFunc" text="添加服务器!" type="ghost" />
  </a-flex>
  <a-flex>
    <lew-button size="medium" :request="addServerFunc" text="提交修改" type="ghost" />
  </a-flex>
</a-flex>
</template>

<style scoped lang="scss">

</style>