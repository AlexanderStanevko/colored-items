<template>
  <div class="card">
    <div class="card-header">
      <div class="card-title">{{ list.name }}</div>
      <button v-if="displayState.length > 1" class="toggle-state-button" @click="toggleState">
        {{ toggleButtonText }}
      </button>
    </div>
    <transition-group name="transition-group" tag="div" class="squares">
      <span v-for="square in displayState" :key="square.uniqueId" class="square"
        :style="{ backgroundColor: square.color }" @click="removeSquare(square.uniqueId)"
      >
      </span>
    </transition-group>
  </div>
</template>

<script>
import { defineComponent, computed, ref, watch } from 'vue'
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
    const wasShuffled = ref(false)

    const toggleButtonText = computed(() => {
      return isSorted.value ? 'Перемешать' : 'Сортировать'
    })

    const displayItems = computed(() => {
      let squares = []
      props.list.items.forEach(item => {
        if (item.checked) {
          for (let i = 0; i < item.quantity; i++) {
            squares.push({
              ...item,
              uniqueId: `${item.id}-${i}`
            })
          }
        }
      })
      return isSorted.value ? squares : shuffleArray(squares)
    })

    const displayState = ref([...displayItems.value])

    const shuffleArray = (array) => {
      let currentIndex = array.length, randomIndex

      while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex--

        [array[currentIndex], array[randomIndex]] = [
          array[randomIndex], array[currentIndex]]
      }

      wasShuffled.value = true
      return array
    }

    const removeSquare = (uniqueId) => {
      const index = displayState.value.findIndex(square => square.uniqueId === uniqueId)
      if (index !== -1) {
        const item = props.list.items.find(item => uniqueId.startsWith(`${item.id}-`))
        if (item && item.quantity > 0) {
          displayState.value.splice(index, 1)
          setTimeout(() => {
            itemsStore.updateItem(props.list.id, item.id, { quantity: item.quantity - 1 })
          }, 0)
        }
      }
    }

    const toggleState = () => {
      isSorted.value = !isSorted.value
      if (isSorted.value) {
        wasShuffled.value = false
        displayState.value = [...displayItems.value]
      } else {
        displayState.value = shuffleArray([...displayItems.value])
      }
    }

    const updateDisplayState = () => {
      const newDisplayState = []
      props.list.items.forEach(item => {
        if (item.checked) {
          for (let i = 0; i < item.quantity; i++) {
            newDisplayState.push({
              ...item,
              uniqueId: `${item.id}-${i}`
            })
          }
        }
      })

      if (!isSorted.value) {
        shuffleArray(newDisplayState)
      }

      displayState.value = newDisplayState
    }

    watch(
      () => props.list.items,
      () => {
        updateDisplayState()
      },
      { deep: true }
    )

    watch(
      () => displayItems.value,
      (newDisplayItems) => {
        if (isSorted.value) {
          displayState.value = [...newDisplayItems]
        }
      },
      { immediate: true }
    )

    return {
      displayState,
      displayItems,
      toggleButtonText,
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

.square {
  display: inline-block;
  width: 20px;
  height: 20px;
  margin: 2px;
  cursor: pointer;
  animation: fadeIn 0.3s ease;
  transition: background-color 0.3s ease;
}

.card {
  border: 2px solid black;
  padding: 1rem;
  margin-bottom: 10px;
}

@media (min-width: 768px) {
  .card-header {
    justify-content: start;
  }

  .toggle-state-button {
    margin-left: auto;
  }
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.5); }
  to { opacity: 1; transform: scale(1); }
}

.transition-group-enter-active, .transition-group-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.transition-group-enter, .transition-group-leave-to {
  opacity: 0;
  transform: scale(0.5);
}
</style>
