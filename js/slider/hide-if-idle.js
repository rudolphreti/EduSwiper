const nextBtn = document.querySelector('.swiper-button-next');
const prevBtn = document.querySelector('.swiper-button-prev');

let timer;
let currSeconds = 0;
//dlaczego taki dziwny zapis?
const hideIfIdle = new (function () {
  this.nav = function (a, b, c, d) {
    nextBtn.style.display = a;
    prevBtn.style.display = b;
    sliderButtons.style.display = c;
    swiperWrapper.style.cursor = d;
  };
  this.resetTimer = function (a, b, c, d, navCallback) {
    navCallback(a, b, c, d);
    clearInterval(timer);
    currSeconds = 0;
    timer = setInterval(hideIfIdle.startTimer, 1000);
  };
  this.startTimer = function () {
    currSeconds += 1;
    if (currSeconds === 5) {
      hideIfIdle.nav('none', 'none', 'none', 'none');
    }
  };
  this.wholeNav = ['flex', 'flex', 'flex', 'grab', this.nav];
})();

const hideIfidleEvListener = () => {
  hideIfIdle.resetTimer.apply(this, hideIfIdle.wholeNav);
};

window.addEventListener('DOMContentLoaded', hideIfidleEvListener);
window.addEventListener('click', hideIfidleEvListener);
window.addEventListener('mousemove', hideIfidleEvListener);
window.addEventListener('mousedown', hideIfidleEvListener);
