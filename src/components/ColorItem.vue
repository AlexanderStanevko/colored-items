<template>
  <div class="color-item">
    <div class="item-details">
      <input type="checkbox" v-model="localItem.checked" @change="emitItemUpdate" />
      <span>{{ localItem.name }}</span>
    </div>
    <div class="item-controls">
      <input type="number" class="quantity-input" v-model.number="localItem.quantity" min="0" @blur="emitItemUpdate" />
      <input type="color" class="color-picker" v-model="localItem.color" @blur="emitItemUpdate" />
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive, watchEffect } from 'vue'
import { useItemsStore } from '../stores/ItemsStore'

export default defineComponent({
  name: 'ColorItem',
  props: {
    item: {
      type: Object,
      required: true,
    },
    listId: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const itemsStore = useItemsStore()
    const localItem = reactive({ ...props.item })

    const emitItemUpdate = () => {
      itemsStore.updateItem(props.listId, props.item.id, {
        checked: localItem.checked,
        quantity: localItem.quantity,
        color: localItem.color,
      });
    };

    watchEffect(() => {
      Object.assign(localItem, props.item)
    })


    return {
      localItem,
      emitItemUpdate,
    }
  },
})
</script>

<style scoped>
.color-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.item-details {
  display: flex;
  align-items: center;
  gap: 10px;
}

.item-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.quantity-input {
  width: 5em;
  border: none;
  background-color: transparent;
  -webkit-appearance: none;
  -moz-appearance: textfield;
  margin-right: 10px;
}

.quantity-input::-ms-clear,
.quantity-input::-ms-reveal {
  display: none;
}

.color-picker {
  width: 40px;
  height: 40px;
  border: none;
  background: none;
  padding: 0;
}

input:focus {
  outline: none;
}

.color-item .item-controls {
  gap: 12px;
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}

@media (max-width: 360px) {
  .color-item {
    flex-direction: column;
  }
}
</style>
