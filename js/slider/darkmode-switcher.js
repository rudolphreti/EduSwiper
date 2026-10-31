const darkmodeSwitcher = document.getElementById('darkmode-switcher');

function sliderColorSwitcher() {
  if (swiperContainer.style.backgroundColor === 'white') {
    swiperContainer.style.backgroundColor = 'black';
    swiperContainer.style.color = 'white';
    darkmodeSwitcher.src = 'images/sun.svg';
  } else {
    swiperContainer.style.backgroundColor = 'white';
    swiperContainer.style.color = 'black';
    darkmodeSwitcher.src = 'images/moon.svg';
  }
}

sliderColorSwitcher();

darkmodeSwitcher.addEventListener('click', sliderColorSwitcher);
