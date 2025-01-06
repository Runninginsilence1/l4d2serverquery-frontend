import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('configStore', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }

  return { count, doubleCount, increment }
})

// 用于在 tag和table中传递选择的tag列表
export const useTagListStore = defineStore('tagList', () => {
  const tagList = ref([])
  const getTagList = computed(() => tagList.value)
  const updateTagList = (newTagList) => {
    tagList.value = newTagList
  }

  return { tagList, getTagList, updateTagList }
})


