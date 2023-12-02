import { defineStore } from 'pinia'

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
        const response = await fetch('/listData.json')
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
      if (allSelected) {
        list.items.forEach(item => item.checked = false)
        list.selectedAll = false
        list.selected = false
      } else {
        list.items.forEach(item => item.checked = true)
        list.selectedAll = true
        list.selected = true
      }
    },
    // toggleItem(listId, itemId) {
    //   const list = this.lists.find(l => l.id === listId)
    //   const item = list?.items.find(i => i.id === itemId)
    //   if (item) {
    //     item.checked = !item.checked

    //     // Проверяем, все ли элементы теперь выбраны
    //     const allSelected = list.items.every(i => i.checked)
    //     const anySelected = list.items.some(i => i.checked)

    //     list.selectedAll = allSelected
    //     list.selected = anySelected
    //   }
    // },
    // updateItemQuantity(listId, itemId, quantity) {
    //   const list = this.lists.find(l => l.id === listId)
    //   const item = list?.items.find(i => i.id === itemId)
    //   if (item) {
    //     item.quantity = quantity
    //   }
    // },
    // updateItemColor(listId, itemId, color) {
    //   const list = this.lists.find(l => l.id === listId)
    //   const item = list?.items.find(i => i.id === itemId)
    //   if (item) {
    //     item.color = color
    //   }
    // },
    updateItem(listId, itemId, updates) {
      const list = this.lists.find(l => l.id === listId)
      if (!list) return

      const itemIndex = list.items.findIndex(i => i.id === itemId)
      if (itemIndex !== -1) {
        // Обновляем элемент, используя объект updates
        Object.assign(list.items[itemIndex], updates)
        
        // Обновляем состояние selected и selectedAll после изменений
        const allSelected = list.items.every(i => i.checked)
        const anySelected = list.items.some(i => i.checked)

        list.selectedAll = allSelected
        list.selected = anySelected
      }
    },
    sortList(id) {
      const list = this.lists.find(l => l.id === id)
      if (!list) return

      list.items = [...this.originalOrder[id]]
      list.state = 'sorted'
    },
    
    shuffleList(id) {
      const list = this.lists.find(l => l.id === id);
      if (!list) return;
    
      // Создаем копию массива
      let tempArray = [...list.items];
    
      // Перемешиваем копию массива
      for (let i = tempArray.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1)); // Переменная j теперь внутри цикла
        [tempArray[i], tempArray[j]] = [tempArray[j], tempArray[i]];
      }
    
      // Обновляем список элементов перемешанным массивом
      list.items = tempArray;
      list.state = 'shuffled';
    },
        
    removeItem(listId, itemId) {
      const list = this.lists.find(l => l.id === listId)
      const itemIndex = list?.items.findIndex(i => i.id === itemId)
      if (itemIndex !== -1) {
        if (list.items[itemIndex].quantity > 1) {
          list.items[itemIndex].quantity--
        } else {
          list.items.splice(itemIndex, 1)
        }
      }
    },
  },
})
