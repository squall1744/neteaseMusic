{
  let view = {
    el: '#tabs',
  }

  let model = {

  }

  let controller = {
    init(view, model) {
      this.view = view
      this.model = model
      this.bindEvents()
    },
    bindEvents() {
      $(this.view.el).on('click', '.tabs-nav li', e => {
        $(e.currentTarget).addClass('active').siblings().removeClass('active')
        let page = $(e.currentTarget).attr('page-name')
        window.eventHub.trigger('selectTab', page)
      })
    }
  }
  controller.init(view, model)
}