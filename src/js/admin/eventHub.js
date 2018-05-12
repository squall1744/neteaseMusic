window.eventHub = {
  events: {},
  on(event, fn) {
    if(this.events[event] === undefined) {
      this.events[event] = []
    }
    this.events[event].push(fn)
  },

  trigger(event, data) {
    for(let key in this.events) {
      if(event === key) {
        let fnList = this.events[key]
        fnList.map( fn => {
          fn.call(undefined, data)
        })
      }
    }
  }
}