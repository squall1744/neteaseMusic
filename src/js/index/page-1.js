{
  let view = {
    el: '.page-1',
    show() {
      $(this.el).addClass('active')
    },
    hide() {
      $(this.el).removeClass('active')
    }
  }

  let model = {

  }

  let controller = {
    init(view, model) {
      this.view = view
      this.model = model
      this.bindEventHub()
      this.loadPage1()
      this.loadPage2()
    },
    bindEventHub() {
      window.eventHub.on('selectTab', page => {
        if(page === 'page-1') {
          this.view.show()
        }else {
          this.view.hide()
        }
      })
    },
    loadPage1() {
      let script = document.createElement('script')
      script.src = './js/index/page-1-1.js'
      document.body.appendChild(script)
      script.onload = function() {
      }
    },
    loadPage2() {
      let script = document.createElement('script')
      script.src = './js/index/page-1-2.js'
      document.body.appendChild(script)
      script.onload = function() {
      }
    }
  }
  controller.init(view, model)
}