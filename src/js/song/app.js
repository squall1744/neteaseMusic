{
  let view = {
    el: '#app',
    render(data) {
      let {song} = data
      $(this.el).css('background-image', `url(${song.cover})`)
      $(this.el).find('.cover').attr('src', song.cover)
      if($(this.el).find('audio').attr('src') !== song.url){
        $(this.el).find('audio').attr('src', song.url)
      }
      
      if(data.status === 'play') {
        $(this.el).find('.disc-container').addClass('playing')
      }else {
        $(this.el).find('.disc-container').removeClass('playing')
      }
    },
    play() {
      $(this.el).find('audio')[0].play()
    },
    pause() {
      $(this.el).find('audio')[0].pause()
    }
  }

  let model = {
    data: {
      song: {
        id: '',
        name: '',
        singer: '',
        url: ''
      },
      status: 'pause'
    },
    getId(id) {
      let query = new AV.Query('Song')
      return query.get(id).then(song => {
        Object.assign(this.data.song, {id: song.id, ...song.attributes})
      })
    }
  }
  
  let controller = {
    init(view, model) {
      this.view = view
      this.model = model
      let id = this.getSongId()
      this.model.getId(id).then(() => {
        this.view.render(this.model.data)
      })
      this.bindEvents()
    },
    getSongId() {
      let search= document.location.search
      if(search.indexOf('?' === 0)) {
        search = search.substring(1)
      }
      let array = search.split('&').filter((v=>v))
      let id = ''

      for(let i=0; i<array.length; i++) {
        let kv = array[i].split('=')
        let key = kv[0]
        let value = kv[1]
        if(key === 'id') {
          id = value
          break
        }
      }
      return id
    },
    bindEvents() {
      $(this.view.el).on('click', '.icon-wrapper .icon-play', () => {
        this.model.data.status = 'play'
        this.view.render(this.model.data)
        this.view.play()
      
      })
      $(this.view.el).on('click', '.icon-wrapper .icon-pause', () => {
        this.model.data.status = 'pause'
        this.view.render(this.model.data)
        this.view.pause()
      })
    } 
  }
  controller.init(view, model)
}
