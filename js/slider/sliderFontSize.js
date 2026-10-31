const sliderFontSizeEl = document.getElementById('slider-font-size'),
  sliderFontSizeInput = sliderFontSizeEl.querySelector('input');

function sliderFontSize(thisEl) {
  setTimeout(function () {
    document
      .querySelectorAll('.swiper-txt-slide .slide-content div')
      .forEach((el) => {
        textFit(el, { multiLine: true, maxFontSize: parseInt(thisEl) });
      });
  }, 1000);
  document.cookie = `sliderFontSize=${thisEl}; expires=Thu, 18 Dec 2099 12:00:00 UTC`;
}

window.addEventListener('resize', function () {
  sliderFontSize(sliderFontSizeInput.value), 1000;
});

document.addEventListener('DOMContentLoaded', () => {
  if (getCookie('sliderFontSize') !== '') {
    sliderFontSizeInput.value = getCookie('sliderFontSize');
  } else {
    sliderFontSizeInput.value = '600';
  }
});
