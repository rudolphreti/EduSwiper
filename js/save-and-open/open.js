// zła nazwa pliku, powinno być "open-project"
const openProjectInput = document.getElementById('open-project'); //zła nazwa zmiennej
let loadingProjectFromfile = false;
let loadingFileIndex = 0;

function openProject(x) {
  loadingProjectFromfile = true;
  destroyAll();
  messageFn(
    `<p>Trwa otwieranie pliku projektu "${x.files[0].name}". ${waitingTime}</p>`
    //${openProjectInput.files[0].name chyba nie działa
  );
  spinnerDisplay(true);
  hideNeedlessElementsBeforeCreatingCards();
  if (ytVideo !== null) {
    ytVideo.remove();
  }

  if (x.files.length > 0) {
    // a po co ten warunek?
    var reader = new FileReader();
    reader.addEventListener('load', function () {
      var result = JSON.parse(reader.result);
      cardSet = result;
    });
    reader.readAsText(x.files[0]);
  }
  reader.addEventListener('loadend', createProjectFromJSON);
}

function createProjectFromJSON() {
  cardSet.cards.forEach((el) => {
    // nie wiadomo dlaczego to nie działa:
    // message.innerHTML = `Dodawanie obrazu nr "${i}"...`;
    createCard(el.imgDataUri, el.word, createCropperInstanceArray);
  });

  //refa, sprawdzić, które funkcje są wspólne z loadEnd()
  setFontSize.value = cardSet.baseFontSize;

  //changeFontSizeForEach(cardSet.baseFontSize); - przeniesione do templates.js -> templates.general -> new Cropper
  //fitTxtContainerEvents();
  if (cardSet.customFont !== undefined && cardSet.customFont !== '') {
    font = new FontFace('Moja czcionka', `url(${cardSet.customFont})`);
    font.load();
    document.fonts.add(font);
    addCustomFontToSelectList();
    pdfMake.vfs.myFont = cardSet.customFont.replace(
      /data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,/,
      ''
    );
  }
}

document
  .getElementById('open-project-button')
  .addEventListener('click', function () {
    openProjectInput.click();
  });
