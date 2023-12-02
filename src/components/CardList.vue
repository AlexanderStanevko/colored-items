<template>
  <div class="card-list">
    <CardListItem
      v-for="list in lists"
      :key="list.id"
      :list="list"
      @removeItem="removeSquare"
    />
  </div>
</template>

<script>
import { defineComponent, computed } from 'vue'
import CardListItem from './CardListItem.vue'
import { useItemsStore } from '../stores/ItemsStore'

export default defineComponent({
  name: 'CardList',
  components: {
    CardListItem,
  },
  setup() {
    const itemsStore = useItemsStore()

    const lists = computed(() => itemsStore.lists)

    const removeSquare = (listId, itemId) => {
      itemsStore.removeItem(listId, itemId)
    }

    return {
      lists,
      removeSquare,
    }
  },
})
</script>
