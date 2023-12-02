<template>
  <div class="items-list">
    <ColorItem v-for="item in items" :key="item.id" :item="item" :listId="list.id"/>
  </div>
</template>

<script>
import { computed, defineComponent } from 'vue'
import ColorItem from './ColorItem.vue'

export default defineComponent({
  name: 'ColorItemsList',
  components: {
    ColorItem,
  },
  props: {
    list : {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const items = computed(() => props.list?.items || [])
    return {
      items,
    }
  },
})
</script>

<style scoped>
.items-list {
  display: flex;
  flex-direction: column;
  padding: 0 3rem;
}

.items-list > div:not(:last-child) {
  margin-bottom: 10px;
}
</style>
