<script lang="ts" setup>
import TableView from './views/TableView.vue';
import AddServerView from './views/AddServerView.vue';
import TagView from './views/TagView.vue';
import { ref } from 'vue';
import { LewButton } from 'lew-ui'
import axios from 'axios';
import { LewMessage } from 'lew-ui';
import cc from 'clipboard';


</script>

<template>


  <!-- <TagView /> -->
   <div class="tag">
    <TagView />
   </div>
   <div class="table">
    <TableView />
   </div>
   <div class="add">
    <AddServerView />
   </div>


  


  
</template>

<style lang="scss" scoped>

.tag {
  border-style: groove;
  border-color: greenyellow;
}

.table {
  margin-top: 10vh;
  border-style: groove;
  border-color: aqua;
}

.add {
  margin-top: 10vh;
  border-style: groove;
  border-color: red;
}
</style>