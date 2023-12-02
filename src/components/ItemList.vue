<template>
  <div>
    <ListWrapper v-for="list in lists" :key="list.id" :list="list" />
  </div>
</template>

<script>
import {
  defineComponent,
  computed,
} from 'vue'
import ListWrapper from './ListWrapper.vue'
import { useItemsStore } from '../stores/ItemsStore'

export default defineComponent({
  name: 'ItemList',
  components: {
    ListWrapper,
  },
  setup() {
    const itemsStore = useItemsStore()
    const lists = computed(() => itemsStore.lists)

    return {
      lists,
    }
  },
})
</script>

<style scoped>
.card-list > div:not(:last-child) {
  margin-bottom: 10px;
}
</style>
