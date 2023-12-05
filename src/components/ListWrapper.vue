<template>
  <div class="list-wrapper">
    <div class="list-header">
      <span :class="['expand-icon', isExpanded ? 'opened' : 'closed']" @click="toggleExpand"></span>
      <input type="checkbox" class="checkbox-field" 
             :class="{ 'partially-selected': isPartiallySelected }"
             :checked="isChecked" @change="toggleCheck">
      <span @click="toggleExpand">{{ list.name }}</span>
    </div>
    <transition name="color-items-list">
      <ColorItemsList v-if="isExpanded" :list="list" />
    </transition>
  </div>
</template>

<script>
import { 
  defineComponent,
  ref, 
  computed, 
  watch
} from 'vue'
import ColorItemsList from './ColorItemsList.vue'
import { useItemsStore } from '../stores/ItemsStore'

export default defineComponent({
  name: 'ListWrapper',
  components: {
    ColorItemsList,
  },
  props: {
    list: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const itemsStore = useItemsStore()

    const isExpanded = ref(false)
    const isChecked = computed(() => props.list.selectedAll)
    const isPartiallySelected = computed(() => props.list.selected && !props.list.selectedAll)

    const toggleCheck = () => {
      itemsStore.toggleList(props.list.id)
    }

    const toggleExpand = () => {
      isExpanded.value = !isExpanded.value
    }

    watch
    (
      () => props.list.items, 
      (newItems) => {
        const allChecked = newItems.every(item => item.checked)
        const anyChecked = newItems.some(item => item.checked)
        props.list.selectedAll = allChecked
        props.list.selected = anyChecked
      }, 
      { immediate: true, deep: true },
    )

    return {
      isChecked,
      isExpanded,
      isPartiallySelected,
      toggleCheck,
      toggleExpand
    }
  },
})
</script>

<style scoped>
.list-wrapper {
  margin-bottom: 1rem;
}

.list-header {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.checkbox-field {
  margin-right: 0.5rem;
  position: relative;
}

.checkbox-field.partially-selected::before {
  content: "•";
  position: absolute;
  top: 55%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.5em;
  line-height: 0;
  color: #555;
}

.expand-icon {
  display: inline-block;
  width: 0;
  height: 0;
  margin-right: 0.5rem;
  border-style: solid;
  transition: transform 0.3s ease;
}

.expand-icon.closed {
  border-width: 10px 0 10px 10px;
  border-color: transparent transparent transparent var(--color-border);
}

.expand-icon.opened {
  border-width: 0 10px 10px 10px;
  border-color: transparent transparent var(--color-border) transparent;
  transform: rotate(180deg);
}

.color-items-list-enter {
  opacity: 0;
}

.color-items-list-enter-active {
  transition: opacity 0.3s ease;
}

.color-items-list-enter-to {
  opacity: 1;
}

.color-items-list-leave-active {
  transition: opacity 0.3s ease;
}

.color-items-list-leave-to {
  opacity: 0;
}
</style>
