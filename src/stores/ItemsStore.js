import { defineStore } from 'pinia'

const findListAndItem = (store, listId, itemId) => {
  const list = store.lists.find(l => l.id === listId)
  if (!list) return {}

  const itemIndex = list.items.findIndex(i => i.id === itemId)
  return { list, itemIndex }
}

export const useItemsStore = defineStore({
  id: 'ItemsStore',
  state: () => ({
    lists: [],
    isListLoading: false,
    originalOrder: {},
  }),
  getters: {
  },
  actions: {
    async fetchLists() {
      try {
        this.isListLoading = true
        const response = await fetch('listData.json')
        if (!response.ok) {
          throw new Error('Error fetching lists')
        }
        const data = await response.json()
        this.lists = data
      } catch (error) {
        console.error('Failed to fetch lists:', error)
      } finally {
        this.isListLoading = false
      }
    },

    saveOriginalOrder() {
      this.lists.forEach(list => {
        this.originalOrder[list.id] = [...list.items]
      })
    },

    toggleList(listId) {
      const list = this.lists.find(l => l.id === listId)
      if (!list) return
    
      const allSelected = list.items.every(item => item.checked)
      list.items.forEach(item => item.checked = !allSelected)
      
      list.selectedAll = !allSelected
      list.selected = !list.selectedAll || list.items.some(item => item.checked)
    },
   
    updateItem(listId, itemId, updates) {
      const { list, itemIndex } = findListAndItem(this, listId, itemId)
      if (itemIndex === -1) return
  
      Object.assign(list.items[itemIndex], updates)
      list.selectedAll = list.items.every(i => i.checked)
      list.selected = list.items.some(i => i.checked)
    },

    removeItem(listId, itemId) {
      const { list, itemIndex } = findListAndItem(this, listId, itemId)
      if (itemIndex === -1) return

      if (list.items[itemIndex].quantity > 1) {
        list.items[itemIndex].quantity--
      } else {
        list.items.splice(itemIndex, 1)
      }
    },
  },
})
