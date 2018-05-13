let $addSong = $('#addSong')
let $newSong = $('#newSong')

$addSong.on('click', 'li', e => {
  $(e.currentTarget).addClass('active').siblings('li').removeClass('active')
  $newSong.removeClass('active')
})

$newSong.on('click', e => {
  $(e.currentTarget).addClass('active')
  $('#addSong ul').find('li').removeClass('active')
})