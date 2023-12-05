<template>
  <div class="container">
    <ItemList />
    <CardList />
  </div>
</template>

<script>
import { defineComponent, onMounted } from 'vue'
import CardList from './components/CardList.vue'
import ItemList from './components/ItemList.vue'
import { useItemsStore } from './stores/ItemsStore'


export default defineComponent({
  name: 'App',
  components: {
    CardList,
    ItemList,
  },
  setup() {
    const itemsStore = useItemsStore()


    onMounted(async () => {
      await itemsStore.fetchLists()
      itemsStore.saveOriginalOrder()
    })
    return {
    }
  },
})
</script>

<style scoped>
.container {
  display: flex;
  justify-content: space-between;
  gap: 4rem;
  min-height: calc(100vh - 4rem);
}

.container>div {
  padding: 2rem 1rem;
  border: 2px solid var(--color-border);
  width: 100%;
  overflow: auto;
  min-height: 100%;
}

@media (max-width: 1024px) {
  .container {
    flex-direction: column;
    justify-content: space-between;
    gap: 4rem;
  }
}
</style>
