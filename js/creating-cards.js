//zła nazwa pliku, powinno być cards-creating albo create-cards

let fitTxtContainersArrayDuringCardsCreating = [];
let changeImgFromInput = false;
let recentImgInput;
function createCard(imgSrc, fitTxtContainerInnerText, cropperInit) {
  mainContainer.style.display = 'flex';
  const cardContainer = document.createElement('DIV');
  const imgContainer = document.createElement('DIV');
  const image = new Image();
  const removeCard = document.createElement('DIV');
  const textContainer = document.createElement('DIV');
  const clearTxt = document.createElement('DIV');
  const fitTxtContainer = document.createElement('DIV');
  fitTxtContainersArrayDuringCardsCreating.push(fitTxtContainer);
  image.src = imgSrc;

  cardContainer.classList.add('card-container');
  imgContainer.classList.add('img-container');
  removeCard.classList.add('remove-icon');
  textContainer.classList.add('text-container');
  clearTxt.classList.add('remove-icon');
  fitTxtContainer.classList.add('fit-txt-container');
  fitTxtContainer.classList.add('fit-txt-container-centering');

  //------ .card-container over events status

  function cardContainerOverEventsStatus(e, status) {
    cardContainer.addEventListener(e, () => {
      overEventOnCardContainer = status;
    });
  }

  ['dragover', 'mouseover'].forEach((el) => {
    cardContainerOverEventsStatus(el, true);
  });

  ['mouseleave', 'dragleave'].forEach((el) => {
    cardContainerOverEventsStatus(el, false);
  });

  function cardContainerActivityHighlighting(e) {
    cardContainer.addEventListener(e, () => {
      firstAddImgInputContainer.style.backgroundColor = 'aliceblue';
      firstAddImgInputContainer.style.boxShadow =
        '6px 6px 15px -15px rgba(0, 0, 0, 0.73)';

      document.querySelectorAll('.card-container').forEach((el) => {
        el.style.backgroundColor = 'white';
        el.setAttribute('active', false);
      });
      cardContainer.setAttribute('active', true);
      cardContainer.style.backgroundColor = 'aliceblue';
      mainContainer.setAttribute('active', false);
      mainContainer.style.backgroundColor = 'white';
    });
  }

  ['click', 'drop', 'contextmenu'].forEach((el) => {
    cardContainerActivityHighlighting(el);
  });

  // cardContainer.addEventListener('click', function () {
  //   document.querySelectorAll('.card-container').forEach((el) => {
  //     el.style.backgroundColor = 'white';
  //     el.setAttribute('active', false);
  //   });
  //   this.setAttribute('active', true);
  //   this.style.backgroundColor = 'aliceblue';
  //   mainContainer.setAttribute('active', false);
  //   mainContainer.style.backgroundColor = 'white';
  // });

  // cardContainer.addEventListener('dragover', () => {
  //   overEventOnCardContainer = true;
  // });
  // cardContainer.addEventListener('mouseover', () => {
  //   overEventOnCardContainer = true;
  // });
  // cardContainer.addEventListener('mouseleave', () => {
  //   overEventOnCardContainer = false;
  // });
  // cardContainer.addEventListener('dragleave', () => {
  //   overEventOnCardContainer = false;
  // });

  //-------------------------

  //------change image input
  const imageInput = document.createElement('input');
  imageInput.type = 'file';
  imageInput.accept = '.jpg, .jpeg, .webp, .png, .svg, .gif';
  cardContainer.appendChild(imageInput);

  const imageInputButton = document.createElement('div');
  imageInputButton.classList.add('change-img-btn');
  cardContainer.appendChild(imageInputButton);
  imageInputButton.addEventListener('click', () => {
    imageInput.click();
  });

  imageInput.addEventListener('change', function () {
    changeImgFromInput = true;
    recentImgInput = this;
    handleFiles(this.files);
    // changeImg(this, image);
  });
  //-------------------------

  //------change image by drag and drop
  const imgDropZone = document.createElement('div');
  imgDropZone.classList.add('img-drop-zone');
  cardContainer.appendChild(imgDropZone);
  imgDropZone.parentElement.addEventListener('dragover', () => {
    imgDropZone.style.zIndex = 2;
    imgDropZone.style.backgroundColor = '#0000004d';
    imgDropZone.style.height = `${(
      cardContainer.offsetHeight - textContainer.offsetHeight
    ).toString()}px`;
  });
  imgDropZone.addEventListener('dragleave', () => {
    imgDropZone.style.zIndex = 0;
    imgDropZone.style.backgroundColor = '#fff0';
    // console.log(`imgDropZone dragleave`);
  });
  imgDropZone.parentElement.addEventListener('drop', () => {
    imgDropZone.style.zIndex = 0;
    imgDropZone.style.backgroundColor = '#fff0';
  });
  imgDropZone.addEventListener('drop', handleDrop, false);

  //-------------------------

  textContainer.addEventListener('drop', (e) => {
    textContainer.getElementsByClassName('textFitted')[0].innerText =
      e.dataTransfer.getData('text');
    fitTxtContainer.style.minWidth = 'unset'; //instrukcja połączona z preventCaretDissapearingIfTxtContainerEmpty()
    // textFit(fitTxtContainer, {
    //   multiLine: true,
    // });
    changeFontSize(fitTxtContainer, setFontSize.value, null);
    if (fitTxtContainer.children[0].innerText === '') {
      fitTxtContainer.children[0].style.width = '100%';
      fitTxtContainer.children[0].style.height = '100%';
    }
  });

  // textContainer.addEventListener('drop', dropTxt);
  textContainer.addEventListener(
    'click',
    preventCaretDissapearingIfTxtContainerEmpty
  );

  removeCard.addEventListener('click', removeCardFn);
  clearTxt.addEventListener('click', clearTxtFn);

  fitTxtContainer.innerText = fitTxtContainerInnerText;

  cardContainer.appendChild(imgContainer);
  imgContainer.appendChild(image);
  cardContainer.appendChild(removeCard);
  textContainer.appendChild(fitTxtContainer);
  textContainer.appendChild(clearTxt);
  cardContainer.appendChild(textContainer);
  preview.appendChild(cardContainer);
  // image.addEventListener('loadend', function () {

  // });
  // if (loadingProjectFromfile !== true) {
  cropperInit(image);
  // }
}

function hideNeedlessElementsBeforeCreatingCards() {
  //to do komponentu menu
  //chyba bardziej show!
  const arr = [
    downloadPdf,
    // editionModeBtn,
    messageContainer,
    sliderOnBtn,
    // selectTemplate.parentElement,
    saveImagesAsZipEl,
  ];
  arr.forEach((el) => {
    el.style.display = 'flex';
  });
  editionModeBtn.style.display = 'block';
  selectTemplate.parentElement.style.display = 'block';
}

function createCardSetCommonInstructions() {
  spinnerDisplay(true);
  hideNeedlessElementsBeforeCreatingCards();
  if (ytVideo !== null) {
    ytVideo.remove();
  }
}

function cardSetCreatingEnd(projectLoad, title, messageArg, font) {
  // addChangeImageBtns(); // dodaj  karty na podstawie obrazów i zobacz co się dzieje w card-container
  if (projectLoad === true) {
    setTitle.innerText = title;

    document.getElementById('select-font').value = font;
    editionModeOff();
    addAd();
  } else {
    editionModeOn();
    if (setTitle.innerText === '') {
      setTitle.innerText = 'Nowy zestaw kart';
    }
  }

  createCardSetCommonInstructions();
  spinner.stop();
  spinnerTarget.style.margin = '0';
  messageFn(messageArg);

  document
    .querySelectorAll('.card-container .img-container')
    .forEach((el, i) => {
      el.children[0].id = `image${i}`;
    });

  changeFont(font);
  wordsListToInput.getElementsByTagName('textarea')[0].value = '';
  if (initialDropZone !== undefined) {
    initialDropZone.remove();
  }
  updateLanguage();
}

// function dropTxt() {
//   const el = this.children[0].children[0];
//   setTimeout(function () {
//     el.innerHTML = el.textContent; //prymitywny sposób na pozbycie się elementów nietekstowych, ale działa
//     changeFontSize(el.parentNode, setFontSize.value, el);
//   }, 500);
// }

function fitTxtContainerEvents() {
  //czy to nie powinno być w createCard(imgSrc, fitTxtContainerInnerText, cropperInit)
  fitTxtContainersArrayDuringCardsCreating.forEach((el) => {
    el.children[0].addEventListener('input', changeFontSizeOnInput);

    el.children[0].addEventListener('paste', function (e) {
      pasteOnlyTxt(e);
    });

    //masking the bug!!!!!//
    jumpingImageOnMobileDevicesWhenSpaceOrBackspaceIsTyped(el.children[0]);
    //masking the bug!!!!!//  });
  });
  fitTxtContainersArrayDuringCardsCreating = [];
}

function pasteOnlyTxt(e) {
  e.preventDefault();
  //czy potrzebne jest tutaj także stopPropagation()?
  var text = (e.originalEvent || e).clipboardData.getData('text/plain');
  document.execCommand('insertText', false, text);
}

setTitle.addEventListener('paste', function (e) {
  pasteOnlyTxt(e);
});
