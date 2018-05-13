{
  let view = {
    el: '#addSong',
    template: `
    <ul>
    </ul>
    `,
    render(data) {
      let { songs } = data
      $(this.el).html(this.template)
      let liList = songs.map( song => $('<li></li>').text(song.name).attr('song-id', song.id) )
      $(this.el).find('ul').empty()
      liList.map( domLi => {
        $(this.el).find('ul').append(domLi)
      } )
    },
    removeActive() {
      $(this.el).find('.active').removeClass('active')
    }
  }

  let model = {
    data: {
      songs: []
    },
    find() {
      let query = new AV.Query('Song')
      return query.find().then( results => {
        this.data.songs = results.map( song => {
          return {id: song.id, ...song.attributes}
        } )
      }, function (error) {
      });
    }
  }

  let controller = {
    init(view, model) {
      this.view = view
      this.model = model
      this.bindEvent()
      this.model.find().then(() => {
        this.view.render(this.model.data)
      })
      
    },
    bindEvent() {
      window.eventHub.on('upload', () => {
        this.view.removeActive()
      })
      window.eventHub.on('create', data => {
        let json = JSON.stringify(data)
        json = JSON.parse(json)
        this.model.data.songs.push(json)
        this.view.render(this.model.data)
      })
      $(this.view.el).on('click', 'li', e => {
        let id = $(e.currentTarget).attr('song-id')
        let data
        for(let i=0; i < this.model.data.songs.length; i++) {
          if(id === this.model.data.songs[i].id) {
            data = this.model.data.songs[i]
            break
          }
        }
        window.eventHub.trigger('select', JSON.parse(JSON.stringify(data)))
      })
    }
  }
  controller.init(view, model)
}