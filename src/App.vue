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


  <TagView />


  <TableView />


  <AddServerView />
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