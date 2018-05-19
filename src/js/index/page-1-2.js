{
  let view = {
    el: '.songs',
    template:`
        <li>
          <h3>{{song.name}}</h3>
          <p>
            <svg class="icon icon-sq">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-sq"></use>
            </svg>
            {{song.singer}}
          </p>
          <a class="playButton" href="./song.html?id={{song.id}}">
            <svg class="icon icon-play">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-play"></use>
            </svg>
          </a>
        </li>
    `,
    render(data) {
      let {songs, select} = data
      songs.map(song => {
        let $li = $(this.template.replace('{{song.name}}', song.name)
            .replace('{{song.id}}', song.id)
            .replace('{{song.singer}}', song.singer))
        $(this.el).find('.list').append($li)
      })
    }
  }

  let model = {
    data: {
      songs: [],
      select: undefined,
    },
    find() {
      var query = new AV.Query('Song');
      return query.find().then(songs => {
        this.data.songs = songs.map(song => {
          return {id: song.id, ...song.attributes}
        })
      })
    }
  }
  let controller = {
    init(view, model) {
      this.view = view
      this.model = model
      this.model.find().then(() => {
        this.view.render(this.model.data)
      })
    }
  }
  controller.init(view, model)
}