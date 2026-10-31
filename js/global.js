const pageTitle = document.getElementById('page-title'),
  mainMenuContainer = document.getElementById('main-menu-container'), //zła nazwa zmiennej! to nie jest menu!
  footer = document.getElementsByTagName('footer')[0],
  mainContainer = document.getElementById('main-container'),
  mainContainerParent = document.getElementById('main-container-parent'),
  firstAddImgInputContainer = document.querySelector(
    '#first-add-img-input-container div'
  ),
  menu = document.getElementById('menu'),
  setContainer = document.getElementById('set-container'),
  setTitle = document.getElementById('set-title'),
  preview = document.querySelector('#preview'), //zła nazwa zmiennej
  ytVideo = document.getElementById('yt-video'),
  addCardsFromImageBottomContainer = document.getElementById(
    'add-cards-from-image-bottom-container'
  ),
  croppAllContainer = document.getElementById('crop-all-container'),
  croppAllSelect = document.getElementById('crop-all-select'),
  creating = document.getElementById('creating'), //zła nazwa, powinno być creatingContainer
  selectTemplateContainer = document.getElementById(
    'select-template-container'
  );

//w trakcie pisania: ostrzeżenie przed utratą danych przy opuszczaniu strony
//onbeforunload
// document.addEventListener('DOMContentLoaded', function () {
//   window.onbeforeunload = function () {
//     return 'Czy na pewno chcesz opuścić stronę? Jeżeli nie projekt nie został zapisany, zostanie on nieodwracalnie utracony.';
//   };
// });

//w trakcie pisania: wielkość pierwszej litery w polu tekstowym

// document.querySelectorAll('.textFitted').forEach((el) => {
//console.log(el.innerText.charAt(0).toLowerCase() + el.innerText.slice(1))
//console.log(el.innerText.charAt(0).toUpperCase() + el.innerText.slice(1))
//el.innerText = el.innerText.charAt(0).toUpperCase() + el.innerText.slice(1)
//   el.innerText = el.innerText.charAt(0).toLowerCase() + el.innerText.slice(1);
// });
