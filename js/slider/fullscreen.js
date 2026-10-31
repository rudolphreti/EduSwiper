const fullScreenIcon = document.getElementById('full-screen-switcher');
const fullscreen = {
  open() {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    }
  },
  close() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  },
  toggle() {
    window.innerHeight !== screen.height ? this.open() : this.close();
  },
  imgToggle() {
    window.innerHeight !== screen.height
      ? (fullScreenIcon.src = 'images/fullscreen.svg')
      : (fullScreenIcon.src = 'images/exit-fullscreen.svg');
  },
};
window.addEventListener('resize', function () {
  fullscreen.imgToggle();
});
fullScreenIcon.addEventListener('click', function () {
  fullscreen.toggle();
  fullscreen.imgToggle();
});
