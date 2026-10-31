const swiperContainer = document.querySelector('.swiper-container');
const swiper = document.getElementsByClassName('swiper')[0];
const sliderButtons = document.getElementById('slider-buttons');
const sliderCloseBtn = document.getElementById('close-btn');
const sliderOnBtn = document.getElementById('slider-on-btn');
const swiperWrapper = document.querySelector('.swiper-wrapper');
const swiperObj = new Swiper('.swiper', {
  loop: true,
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  grabCursor: true,
});

function createSlider() {
  swiperContainer.style.display = 'flex';
  swiperContainer.style.zIndex = 3;
  swiper.style.display = 'flex';
  swiper.style.position = 'absolute';
  document.body.style.position = 'absolute';

  arr = [pageTitle, mainMenuContainer, examples, messageContainer, footer];
  //div creating nie jest tu uwzględniony;
  //ma on overflow='hidden';
  //jest ukrywany (display: 'none') i następuje wyjście z pełnego ekranu,
  //to pojawia się błąd w cropperze - kadrowanie się zmienia,
  //a do punktu wyjścia wraca dopiero,
  //gdy zmieniany jest rozmiar okna lub przy zoomie
  arr.forEach((el) => {
    el.style.display = 'none';
  });
  instanceArray.forEach((el) => {
    const swiperTxtSlide = document.createElement('DIV');
    const txt = document.createElement('DIV');
    const txtSlideContent = document.createElement('DIV');

    txtSlideContent.classList.add('slide-content');
    swiperTxtSlide.classList.add('swiper-slide');
    swiperTxtSlide.classList.add('swiper-txt-slide');

    txt.innerText =
      el.container.parentNode.querySelector('.text-container').innerText;
    swiperTxtSlide.appendChild(txtSlideContent);
    txtSlideContent.appendChild(txt);
    swiperWrapper.appendChild(swiperTxtSlide);
    textFit(txt, {
      multiLine: true,
      maxFontSize: parseInt(sliderFontSizeEl.querySelector('input').value),
    });

    const swiperImgSlide = document.createElement('DIV');
    const imgSlideContent = document.createElement('DIV');
    imgSlideContent.classList.add('slide-content');

    swiperImgSlide.classList.add('swiper-slide');
    swiperImgSlide.classList.add('swiper-img-slide');
    const img = new Image();
    img.src = el.originalUrl;
    img.title =
      el.container.parentNode.querySelector('.text-container').innerText;
    imgSlideContent.appendChild(img);
    swiperImgSlide.appendChild(imgSlideContent);
    swiperWrapper.appendChild(swiperImgSlide);
  });
  swiperObj.update();
  updateLanguage();
}

function destroySlider() {
  if (window.innerHeight === screen.height) {
    fullscreen.close();
  }
  swiperObj.removeAllSlides();
  swiperContainer.style.display = 'none';
  document.body.style.position = 'initial';
  arr = [pageTitle, creating, messageContainer, footer];
  arr.forEach((el) => {
    el.style.display = 'flex';
  });
  mainMenuContainer.style.display = 'block';
}

sliderCloseBtn.addEventListener('click', destroySlider);

swiperObj.on('orientationchange', function () {
  setTimeout(
    sliderFontSize(sliderFontSizeEl.querySelector('input').value),
    500
  );
});
