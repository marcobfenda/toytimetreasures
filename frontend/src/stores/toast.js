import { defineStore } from 'pinia'

export const useToastStore = defineStore('toast', {
  state: () => ({
    visible: false,
    message: '',
    type: 'info'
  }),
  actions: {
    show(message, type = 'info', timeout = 3000) {
      this.message = message
      this.type = type
      this.visible = false
      // ensure next tick
      setTimeout(() => { this.visible = true }, 10)
      if (timeout > 0) setTimeout(() => { this.visible = false }, timeout + 10)
    }
  }
})
