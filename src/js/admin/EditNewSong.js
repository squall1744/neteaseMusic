{
  let view = {
    el: '#main',
    template: `
  <div class="content">
    <div>
      <label for="name">歌名</label>
      <input type="text" name="name" id="name" value="__name__">
    </div>
    <div>
      <label for="singer">歌手</label>
      <input type="text" name="singer" id="singer" value="__singer__">
    </div>
    <div>
      <label for="link">链接</label>
      <input type="text" name="url" id="link" value="__url__">          
    </div>
    <button>保存</button>
  </div>
    `,
      render(data = {}) {
        let placeholder = ['id', 'name', 'singer', 'url']
        html = this.template
        placeholder.map(key => {
          html = html.replace(`__${key}__`, data[key] || '')
        })
        $(this.el).html(html)
        if(data.id){
          $(this.el).prepend('<h1>编辑歌曲</h1>')
        }else{
          $(this.el).prepend('<h1>新建歌曲</h1>')
        }
      },
      reset() {
        this.render({})
      }
    }

    let model = {
      data: {id:'', name:'', singer:'', url:'',},
      create(data) {
        let Song = AV.Object.extend('Song');
        let song = new Song()
        song.set('name',data.name)
        song.set('singer',data.singer)
        song.set('lyrics', data.lyrics)
        song.set('url',data.url)
        song.set('cover',data.cover)
        return song.save().then(newSong => {
          let {id, attributes} = newSong
          Object.assign(this.data, {id, ...attributes})
        })
      },
      update(data) {
        let song = AV.Object.createWithoutData('Song', this.data.id)
        song.set('name', data.name)
        song.set('singer', data.singer)
        song.set('lyrics', data.lyrics)
        song.set('url', data.url)
        song.set('cover', data.cover)
        return song.save().then(newSong => {
          let {id, attributes} = newSong
          Object.assign(this.data, {id, ...attributes})
        })
      }
    }
    
    let controller = {
      init(view, model) {
        this.view = view
        this.model = model
        this.view.render(this.model.data)
        window.eventHub.on('new', data => {
          if(this.model.data.id){
            this.model.data = {
              name: '', url: '', id: '', singer: '', lyrics: ''
            }
          }else {
            Object.assign(this.model.data, data)
          }
          this.view.render(this.model.data)
        })
        window.eventHub.on('select', data => {
          Object.assign(this.model.data, data)
          this.view.render(this.model.data)
        })
        this.bindEvents()
      },
      create() {
        let needs = ['id', 'singer', 'name', 'url']
        let data = {}
        needs.map(key => {
          data[key] = $(this.el).find(`[name="${key}"]`).val()
        })
        this.model.create(this.model.data).then(() => {
          window.eventHub.trigger('create', JSON.parse(JSON.stringify(this.model.data)))
          this.view.reset()
        })
      },
      update() {
        let needs = ['id', 'singer', 'name', 'url']
        let data = {}
        needs.map(key => {
          data[key] = $(this.el).find(`[name="${key}"]`).val()
        })
        this.model.update(this.model.data).then(() => {
          window.eventHub.trigger('create', JSON.parse(JSON.stringify(this.model.data)))
          this.view.reset()
        })
      },
      bindEvents() {
        $(this.view.el).on('click', 'button', e => {
          console.log('click')
          if(this.model.data.id) {
            this.update()
          }else {
            this.create()
          }
        })
      }
    }
  
  controller.init(view, model)
}