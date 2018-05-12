{
  let view = {
    el: '#main',
    template: `
  <h1>新建歌曲</h1>
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
      let placeholder = ['name', 'singer', 'url']
      let template = this.template
      placeholder.map( item => {
        template = template.replace(`__${item}__`, data[item] || '')
      })
      $(this.el).html(template)
    },
  }

  let model = {
    data: {
      name: '',
      singer: '',
      url: ''
    },
    create(data) {
      // 声明类型
      var Song = AV.Object.extend('Song');
      // 新建对象
      var song = new Song();
      // 设置名称
      song.set('name', data.name);
      song.set('singer', data.singer);
      song.set('url', data.url);
      return song.save().then((newSong) => {
        let {id, attributes} = newSong
        Object.assign(this.data, {
          id,
          ...attributes
        })
      }, (error) => {
        console.error(error);
      });
    }
  }

  let controller = {
    init(view, model) {
      this.view = view
      this.model = model
      this.view.render()
      this.bindEvent()
    },
    bindEvent() {
      window.eventHub.on('getLink', data => {
        this.view.render(data)
      })
      $(this.view.el).on('click', 'button', e => {
        let items = ['name', 'singer', 'url']
        let data = {}
        items.map( item => {
          data[item] = $(this.view.el).find(`[name="${item}"]`).val()
        })
        this.model.create(data).then(() => {
          this.view.render({})
        })
      })
    }
  }
  controller.init(view, model)
}