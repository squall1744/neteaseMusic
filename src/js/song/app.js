{
  let view = {
    el: '#app',
    render(data) {
      let {song} = data
      $(this.el).find('.background').css('background-image', `url(${song.cover})`)
      $(this.el).find('.cover').attr('src', song.cover)
      if($(this.el).find('audio').attr('src') !== song.url){
        let audio = $(this.el).find('audio').attr('src', song.url).get(0)
        audio.onended = () => {window.eventHub.trigger('songEnd', {})}
        audio.ontimeupdate = () => {
          this.showLyrics(audio.currentTime)
        }
      }

      if(data.status === 'play') {
        $(this.el).find('.disc-container').addClass('playing')
      }else {
        $(this.el).find('.disc-container').removeClass('playing')
      }

      $(this.el).find('.song-description h1').text(song.name)
      let array = song.lyrics.split('\n')
      array.map(line => {
        let $p = $(document.createElement('p'))
        let regex = /\[([\d:.]+)\](.+)/
        let matches =line.match(regex)
        if(matches) {
          let parts = matches[1].split(':')
          let newTime = parseInt(parts[0]) * 60 + parseFloat(parts[1])
          $p.text(matches[2]).attr('timeline', newTime)
        }else {
          $p.text(line)
        }
        $(this.el).find('.lyric .lines').append($p)
      })
    },
    play() {
      $(this.el).find('audio')[0].play()
    },
    pause() {
      $(this.el).find('audio')[0].pause()
    },
    showLyrics(time) {
      let $pList = $(this.el).find('.lyric .lines p')
      for(let i=0; i<$pList.length; i++) {
        if(i === $pList.length-1) {
          console.log($pList[i])
          break
        }else {
          let currentTime = $pList.eq(i).attr('timeline')
          let nextTime = $pList.eq(i+1).attr('timeline')
          if(time >= currentTime && time <= nextTime) {
            console.log($pList[i])
            break
          }
        }
      }
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
      window.eventHub.on('songEnd', () => {
        this.model.data.status = 'pause'
        this.view.render(this.model.data)
      })
    } 
  }
  controller.init(view, model)
}
