{
  let view = {
    el: '#newSong',
    template: `新建歌曲`,
    addActive() {
      $(this.el).addClass('active')
    },
    render(data) {
      $(this.el).html(this.template)
    }
  }

  let model = {}

  let controller = {
    init(view, model) {
      this.view = view
      this.model = model
      this.view.render(this.model.data)
      this.bindEvent()
    },
    bindEvent() {
      window.eventHub.on('upload', () => {
        this.view.addActive()
      })
    }
  }
  controller.init(view, model)
}