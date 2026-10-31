const addImages = document.querySelector('#file-input'); //zła nazwa id i zmiennej, powinno być: addImagesInput

const wordRegexReplacement = {
  '.[^/.]+$': '',
};
let filesLength = 0;
let readerFileIndex;

String.prototype.allReplace = function (obj) {
  let retStr = this;
  for (const x in obj) {
    retStr = retStr.replace(new RegExp(x, 'g'), obj[x]);
  }
  return retStr;
};

// function createCardSet(el) {
//   //powinno być createCardSetFromImage
//   loadingProjectFromfile = false;
//   readerFileIndex = 0;
//   createCardSetCommonInstructions();

//   filesLength = el.files.length;
//   if (el.files) {
//     [].forEach.call(el.files, readAndPreview);
//   }

//   function readAndPreview(file) {
//     if (!/\.(jpe?g|png|gif|svg|webp|avif)$/i.test(file.name)) {
//       //przenieść ten regex do zmiennej globalnej
//       return alert(file.name + ' to plik o nieobsługiwanym formacie');
//     } //to jest potrzebne; parametr accept w HTML filtruje pliki w browse

//     const reader = new FileReader();

//     reader.addEventListener('load', function () {
//       let res = file.name.allReplace(wordRegexReplacement);
//       messageFn(`<p>Trwa dodawanie obrazu "${file.name}". ${waitingTime}</p>`);

//       createCard(this.result, res, createCropperInstanceArray);

//       readerFileIndex++;
//     });

//     reader.readAsDataURL(file);
//     reader.addEventListener('loadend', loadEnd);
//   }
// }
function loadEnd() {
  //refa, sprawdzić, które funkcje są wspólne z createProjectFromJSON()
  addImg = false;
  if (readerFileIndex === filesLength) {
    addImg = false;
    cardSetCreatingEnd(
      false,
      undefined,
      `Liczba kart utworzonych ostatnio na podstawie obrazów: ${readerFileIndex}. Liczba kart w zestawie: ${instanceArray.length}`,
      selectFont.value
    );
    changeFontSizeForEach(setFontSize.value);
    fitTxtContainerEvents();
    // jump(`image${instanceArray.length - 1}`);
    jump();
  }
}

// addImages.addEventListener('change', createCardSet);

//w trakcie pisania
// function jump(h) {
//   let referenceContainer =
//     document.getElementById(h).parentElement.parentElement;
//   var offsetTop = referenceContainer.offsetTop;
//   window.scrollTo(0, offsetTop + parseInt(referenceContainer.offsetHeight));
// }

function jump() {
  window.scrollTo(0, document.body.scrollHeight);
}

function addReferenceFromImageInputClick() {
  addImages.click(); //wszystkie tego typu funkcje mogłyby być w jednej
}
document
  .querySelector('#add-cards-from-image-bottom-container button')
  .addEventListener('click', addReferenceFromImageInputClick);

addImages.nextElementSibling.addEventListener(
  'click',
  addReferenceFromImageInputClick
);
