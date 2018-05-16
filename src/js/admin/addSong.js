{
  let view = {
    el: '#addSong',
    template: `
    <ul>
    </ul>
    `,
    render(data) {
      let {songs, select} = data
      $(this.el).html(this.template)
      let liList = songs.map(song => {
        let $li = $('<li></li>').text(song.name).attr('song-id', song.id)
        if(song.id === select) {
          $li.addClass('active')
        }
        return $li
      })
      $(this.el).find('ul').empty()
      liList.map(li => {
        $(this.el).find('ul').append(li)
      })
    },
    clearActive(){
      $(this.el).find('.active').removeClass('active')
    }
  }

  let model = {
    data: {
      songs: [],
      select: undefined
    },
    find() {
      let query = new AV.Query('Song')
      return query.find().then(results => {
        this.data.songs = results.map(song => {
          return {id: song.id, ...song.attributes}
        })
      })
    }
  }

  let controller = {
    init(view, model) {
      this.view = view
      this.model = model
      this.bindEvents()
      this.getAllSongs()
      window.eventHub.on('create', data => {
        this.model.data.songs.push(data)
        this.view.render(this.model.data)
      })
      window.eventHub.on('new', data => {
        this.view.clearActive()
      })
      window.eventHub.on('update', song => {
        let songs = this.model.data.songs
        for(let i=0; i<songs.length; i++) {
          if(songs[i].id === song.id) {
            Object.assign(songs[i], song)
            break
          }
        }
        this.view.render(this.model.data)
      })
    },
    getAllSongs() {
      return this.model.find().then(() => {
        this.view.render(this.model.data)
      })
    },
    bindEvents() {
      $(this.view.el).on('click', 'li', e => {
        let songId = e.currentTarget.getAttribute('song-id')
        this.model.data.select = songId
        this.view.render(this.model.data)

        let data
        let songs = this.model.data.songs
        for(let i=0; i<songs.length; i++) {
          if(songs[i].id === songId) {
            data = songs[i]
          }
        }
        window.eventHub.trigger('select', JSON.parse(JSON.stringify(data)))
      })
    }
  }
  controller.init(view, model)
}