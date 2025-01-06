<script lang="ts" setup>
import {LewAlert, LewButton, LewMessage} from "lew-ui";

const tipsConsoleFunc = () => {
  LewMessage.success({
    content: '请在控制台中查看',
    duration: 3000
  })
}

const resultFunc = (data: any) => {
  LewMessage.success({
    content: data.toString(),
    duration: 3000
  })
}

// write your code here
const testFunc = () => {
  
}
</script>

<template>
  <lew-button size="medium" :request="tipsConsoleFunc" text="调试按钮" type="ghost"/>
<!--  <lew-button size="medium" :request="tipsConsoleFunc" text="调试按钮" type="ghost"/>-->
</template>

<style scoped lang="scss">

</style>