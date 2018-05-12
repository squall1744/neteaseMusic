let $ul = $('#addSong ul')
let $newSong = $('#newSong')

$ul.on('click', 'li', e => {
  $(e.currentTarget).addClass('active').siblings('li').removeClass('active')
  $newSong.removeClass('active')
})

$newSong.on('click', e => {
  $(e.currentTarget).addClass('active')
  $ul.find('li').removeClass('active')
})