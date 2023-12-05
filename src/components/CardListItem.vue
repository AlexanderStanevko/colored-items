<template>
  <div class="card">
    <div class="card-header">
      <div class="card-title">
        {{ list.name }}
      </div>
      <button 
        v-if="showToggleButton" 
        class="toggle-state-button" 
        @click="toggleState"
      >
        {{ toggleButtonText }}
      </button>
    </div>
    <transition-group 
      name="transition-group" 
      tag="div" 
      class="squares"
      :class="{ 'sorted': isSorted, 'shuffled': !isSorted }"
    >
      <div 
        v-for="(group, index) in groupedSquares" 
        :key="index" 
        class="square-row"
      >
        <span 
          v-for="square in group" 
          :key="square.uniqueId" 
          class="square" 
          :style="{ backgroundColor: square.color }"
          @click="removeSquare(square.uniqueId)"
        >
        </span>
      </div>
    </transition-group>
  </div>
</template>

<script>
import { 
  defineComponent, 
  computed, 
  ref, 
  watch, 
  nextTick, 
  onMounted 
} from 'vue'
import { useItemsStore } from '../stores/ItemsStore'

export default defineComponent({
  name: 'CardListItem',
  props: {
    list: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const itemsStore = useItemsStore()
    const isSorted = ref(true)
    const displayState = ref([])
    const removedItems = ref([])

    const toggleButtonText = computed(() => isSorted.value ? 'Shuffle' : 'Sort')

    const showToggleButton = computed(() => {
      const checkedItemsCount = props.list.items.reduce(
        (count, item) => count + (item.checked && item.quantity > 0 ? 1 : 0), 0
      )
      return checkedItemsCount >= 2
    })

    const groupedSquares = computed(() => {
      return isSorted.value
        ? displayState.value.reduce((groups, square) => {
            (groups[square.color] = groups[square.color] || []).push(square)
            return groups
          }, {})
        : [displayState.value]
    })


    const shuffleArray = (array) => {
      let currentIndex = array.length, randomIndex

      while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex--

        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]
      }

      return array
    }

    const createDisplayState = () => {
      let squares = props.list.items
        .filter(item => item.checked)
        .flatMap(item => Array.from({ length: item.quantity }, (_, i) => ({
          ...item,
          uniqueId: `${item.id}-${i}`
        })))

      return squares
    }

    const updateQuantity = (item, quantityChange) => {
      itemsStore.updateItem(props.list.id, item.id, { quantity: item.quantity + quantityChange })
    }

    const removeSquare = (uniqueId) => {
      const index = displayState.value.findIndex(square => square.uniqueId === uniqueId)
      if (index !== -1) {
        const item = props.list.items.find(item => uniqueId.startsWith(`${item.id}-`))
        if (item && item.quantity > 0) {
          displayState.value.splice(index, 1)
          removedItems.value.push(uniqueId)
          nextTick(() => updateQuantity(item, -1))
        }
      }
    }

    const toggleState = () => {
      isSorted.value = !isSorted.value
      if (!isSorted.value) {
        displayState.value = shuffleArray([...createDisplayState()])
      } else if (isSorted.value) {
        displayState.value = createDisplayState()
      }
    }

    const updateShuffledDisplayState = (newVal) => {
      if (removedItems.value.length) {
        removedItems.value = []
        return
      }

      const totalQuantity = newVal.reduce((sum, item) => item.checked ? sum + item.quantity : sum, 0)
      const currentTotalQuantity = displayState.value.length

      if (totalQuantity !== currentTotalQuantity) {
        displayState.value = shuffleArray(createDisplayState())
        return
      }

      displayState.value = displayState.value.map(item => {
        const updatedItem = newVal.find(({ id }) => id === item.id)
        return updatedItem && updatedItem.checked ? { ...item, ...updatedItem } : item
      }).filter(item => item.checked)
   }


    watch(() => props.list.items, (newVal) => {
      if (!isSorted.value) {
        updateShuffledDisplayState(newVal)
      } else {
        displayState.value = createDisplayState()
      }
    }, { deep: true })

    onMounted(() => {
      displayState.value = createDisplayState()
    })

    return {
      isSorted,
      removedItems,
      displayState,
      toggleButtonText,
      groupedSquares,
      showToggleButton,
      removeSquare,
      toggleState,
    }
  },
})
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.card-title {
  font-weight: bold;
}

.toggle-state-button {
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.square-row {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(20px, 1fr));
  gap: 2px;
}

.square {
  height: 20px;
  margin: 2px 0;
  cursor: pointer;
  animation: fadeIn 0.3s ease;
  transition: background-color 0.3s ease;
}

.card {
  border: 2px solid var(--color-border);
  padding: 1rem;
  margin-bottom: 10px;
}

@media (max-width: 260px) {
  .card-header {
    flex-direction: column;
  }

  .toggle-state-button {
    margin-top: 0.5rem;
    width: 100%;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.5);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

.transition-group-enter-active,
.transition-group-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.transition-group-enter,
.transition-group-leave-to {
  opacity: 0;
  transform: scale(0.5);
}
</style>
