const { Howl, Howler } = require('howler');

var sound = new Howl({
  src: ['/audio/octocat.ogg']
});

const buttonPlay = document.getElementById('audio');

buttonPlay.addEventListener('click', () => {
  sound.play();
});
