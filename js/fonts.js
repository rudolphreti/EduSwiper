const selectFontContainer = document.getElementById('select-font-container'); //fontTypeInputContainer lepiej
const selectFont = document.getElementById('select-font'); //fontTypeInput lepiej
const setFontSize = document.getElementById('font-size'); //fontSizeInput lepiej

function changeFontSize(el1, fontSize, el2) {
  //przy dropTxt() funkcja uruchamia się dwa razy, dlaczego?
  textFit(el1, {
    multiLine: true,
    minFontSize: fontSize,
    maxFontSize: fontSize,
  });

  if (el2 !== null) {
    //zob. komentarz przy else if
    if (
      el1.offsetHeight < el2.offsetHeight ||
      el1.offsetWidth < el2.offsetWidth
    ) {
      textFit(el1, { multiLine: true });
    }
  } else if (
    //powiązanie z funkcją changeFontSizeForEach(fontSizeArg)
    //musi tutaj być ten warunek, bo w funkcji changeFontSizeForEach(fontSizeArg) el.childNodes[0] wskazuje na spana dopiero po jego utworzeniu
    // jeżeli podamy el.childNodes[0] jako argument el2 dla funkcji changeFontSize() to zwróci on #textNode
    el1.offsetHeight < el1.childNodes[0].offsetHeight ||
    el1.offsetWidth < el1.childNodes[0].offsetWidth
  ) {
    textFit(el1, { multiLine: true });
  }
}

function changeFontSizeForEach(fontSizeArg) {
  document.querySelectorAll('.fit-txt-container').forEach((el) => {
    changeFontSize(el, fontSizeArg, null);
    el.childNodes[0].contentEditable = 'true';
  });
}

function changeFont(x) {
  // console.log('changeFont');
  //zła nazwa funkcji, powinno być changeFontType
  mainContainer.style.fontFamily = x; //zmienną mainContainer do osobnego komponentu
  swiperWrapper.style.fontFamily = x;

  switch (x) {
    case 'Calibri':
      getFont('calibri');
      break;
    case 'Times':
      getFont('times1');
      break;
    case 'Century Gothic':
      getFont('GOTHIC');
      break;
  }
}

function changeFontSizeOnInput() {
  this.style.minWidth = 'unset'; //instrukcja połączona z preventCaretDissapearingIfTxtContainerEmpty()
  changeFontSize(this.parentNode, setFontSize.value, this);
}

function preventCaretDissapearingIfTxtContainerEmpty() {
  if (this.innerText === '') {
    this.children[0].children[0].style.minWidth = '36px';
  }
}

const fontOptionsSwitcherBtn = document.getElementById('font-options-switcher');
const fontOptions = document.getElementById('font-options');

// function showFontOptions() {
//   if (fontOptionsSwitcherBtn.style.display !== 'none') {
//     fontOptionsSwitcherBtn.style.display = 'none';
//     fontOptions.style.display = 'inherit';
//     selectFontContainer.classList.add('color-div');
//   }
// }

// fontOptionsSwitcherBtn.addEventListener('click', showFontOptions);

// function hideFontOptions(e) {
//   var isClickInsideElement = selectFontContainer.contains(e.target);
//   if (!isClickInsideElement) {
//     fontOptionsSwitcherBtn.style.display = 'inherit';
//     fontOptions.style.display = 'none';
//     selectFontContainer.classList.remove('color-div');
//   }
// }

// document.addEventListener('click', hideFontOptions);

fontOptionsSwitcherBtn.addEventListener('click', function () {
  showOptions(fontOptionsSwitcherBtn, fontOptions, selectFontContainer);
});

document.addEventListener('click', function (e) {
  hideOptions(e, selectFontContainer, fontOptionsSwitcherBtn, fontOptions);
});
