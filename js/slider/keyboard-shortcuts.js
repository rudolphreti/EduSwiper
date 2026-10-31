let keyboardShortcuts = (e) => {
  const condition = document.activeElement.type;
  if (condition !== 'number' && condition !== 'text' && condition !== 'range') {
    switch (e.keyCode) {
      case 27:
        destroySlider();
        break;
      case 37:
      case 38:
        swiperObj.slidePrev();
        break;
      case 39:
      case 40:
      case 32:
        swiperObj.slideNext();
        break;
      //   case 70:
      //     fullscreen.toggle();
      //     break;
    }
  }
};

window.addEventListener('keydown', keyboardShortcuts);
window.addEventListener('keyup', (e) => {
  if (e.keyCode === 32) {
    e.preventDefault();
  }
});
