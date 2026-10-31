document.body.addEventListener(
  // to chyba niepotrzebne
  'dragover',
  function (e) {
    e.preventDefault();
    e.stopPropagation();
  },
  false
);

document.body.addEventListener(
  'drop',
  function (e) {
    e.preventDefault();
    e.stopPropagation();
  },
  false
);

let recentDropZone;
function handleDrop(e) {
  recentDropZone = this;
  var dt = e.dataTransfer,
    files = dt.files;

  if (files.length) {
    handleFiles(files);
  } else {
    // check for img
    var html = dt.getData('text/html'),
      match = html && /\bsrc="?([^"\s]+)"?\s*/.exec(html),
      url = match && match[1];

    // console.log('!!!HTML ' + html);

    if (url) {
      uploadImageFromURL(url);
      return;
    }
  }

  function uploadImageFromURL(url) {
    var img = new Image();
    var c = document.createElement('canvas');
    var ctx = c.getContext('2d');

    img.onload = function () {
      c.width = this.naturalWidth; // update canvas size to match image
      c.height = this.naturalHeight;
      ctx.drawImage(this, 0, 0); // draw in image
      c.toBlob(function (blob) {
        // get content as PNG blob

        // call our main function
        handleFiles([blob]);
      }, 'image/png');
    };
    img.onerror = function (e) {
      alert(
        `Błąd podczas ładowania obrazu. Spróbuj go skopiować i wkleić za pomocą klawiszy Ctrl + V.`
      );
      console.log(e);
    };
    img.crossOrigin = ''; // if from different origin
    img.src = url;
  }
}

function handleFiles(files) {
  readerFileIndex = 0;
  filesLength = files.length;
  //uwzględnić sytuację, ze ktoś może do card-container ładować więcej plików, a można tylko jeden
  for (var i = 0, len = files.length; i < len; i++) {
    //nie lepiej forEach?
    if (validateImage(files[i])) {
      previewAnduploadImage(files[i]);
    }
  }
}

function validateImage(image) {
  // check the type
  var validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif'];
  if (validTypes.indexOf(image.type) === -1) {
    alert('Nieprawidłowy format pliku.');
    return false;
  }

  // check the size
  var maxSizeInBytes = 50e6; // 50MB
  if (image.size > maxSizeInBytes) {
    alert('Plik jest za duży. Maksymalny rozmiar to 50MB.');
    return false;
  }

  return true;
}

let overEventOnCardContainer = false; //to powinno się chyba nazywać overCardContainer

function previewAnduploadImage(image) {
  // console.log(
  //   overEventOnCardContainer === true && changeImgFromInput === false
  // );
  // console.log(changeImgFromInput === true);

  // previewing image
  var img = document.createElement('img');

  // read the image...
  var reader = new FileReader();
  // nie wiem czemu, nie mogę tych dwóch ifów zrefaktoryzować do changeImg(readerArg, el, imgArg, status)
  // pojawiają się błędy choć wydaje mi się, że wszystko robię dobrze

  if (
    overEventOnCardContainer === true &&
    changeImgFromInput === false &&
    changeReferenceImgByPaste === false
  ) {
    reader.onloadend = function (e) {
      const changedImg = recentDropZone.parentElement.querySelector('img');
      const cropperNumber = parseInt(changedImg.id.match(/\d+/g)[0]);
      instanceArray[cropperNumber].destroy();
      img.src = e.target.result;
      changedImg.src = img.src;
      instanceArray[cropperNumber] = new Cropper(changedImg, {
        //wspólne parametry do jednego obiektu, zob.: templates.general, createCropperInstanceArray(image)
        dragMode: 'move',
        restore: false,
        guides: false,
        highlight: false,
        cropBoxMovable: false,
        cropBoxResizable: false,
        toggleDragModeOnDblclick: false,
        background: false,
        modal: false,
        center: true,
      });
      overEventOnCardContainer = false;
    };
  }
  if (changeImgFromInput === true) {
    // console.log('change img by input');

    reader.onloadend = function (e) {
      const changedImg = recentImgInput.parentElement.querySelector('img');
      const cropperNumber = parseInt(changedImg.id.match(/\d+/g)[0]);
      instanceArray[cropperNumber].destroy();
      img.src = e.target.result;
      changedImg.src = img.src;
      instanceArray[cropperNumber] = new Cropper(changedImg, {
        //wspólne parametry do jednego obiektu, zob.: templates.general, createCropperInstanceArray(image)
        dragMode: 'move',
        restore: false,
        guides: false,
        highlight: false,
        cropBoxMovable: false,
        cropBoxResizable: false,
        toggleDragModeOnDblclick: false,
        background: false,
        modal: false,
        center: true,
      });
      changeImgFromInput = false;
    };
  }
  if (changeReferenceImgByPaste === true) {
    // console.log('change img by paste');

    reader.onloadend = function (e) {
      const changedImg = document
        .querySelector(".card-container[active='true']")
        .querySelector('img');
      const cropperNumber = parseInt(changedImg.id.match(/\d+/g)[0]);
      instanceArray[cropperNumber].destroy();
      img.src = e.target.result;
      changedImg.src = img.src;
      instanceArray[cropperNumber] = new Cropper(changedImg, {
        //wspólne parametry do jednego obiektu, zob.: templates.general, createCropperInstanceArray(image)
        dragMode: 'move',
        restore: false,
        guides: false,
        highlight: false,
        cropBoxMovable: false,
        cropBoxResizable: false,
        toggleDragModeOnDblclick: false,
        background: false,
        modal: false,
        center: true,
      });
      changeReferenceImgByPaste = false;
    };
  }
  if (addImg === true) {
    if (readerFileIndex === 0) {
      loadingProjectFromfile = false;
      createCardSetCommonInstructions();
    }

    reader.onload = function (e) {
      let res;
      function resFn() {
        if (image.name !== undefined) {
          res = image.name.allReplace(wordRegexReplacement);
        } else res = 'image';
      }
      resFn();

      messageFn(`<p>Trwa dodawanie obrazu "${image.name}". ${waitingTime}</p>`);

      createCard(e.target.result, res, createCropperInstanceArray);

      readerFileIndex++;

      if (readerFileIndex === filesLength) {
        reader.addEventListener('loadend', loadEnd);
      }
    };
  }

  reader.readAsDataURL(image);
}

function mainContainerDragAndDropEvents() {
  mainContainer.addEventListener('dragover', () => {
    if (editionModeOnStatus === true && overEventOnCardContainer === false) {
      mainContainer.style.backgroundColor = 'whitesmoke';
    }
  });

  mainContainer.addEventListener('dragleave', () => {
    mainContainer.style.backgroundColor = 'white';
  });

  // mainContainer.addEventListener('click', () => {
  //   if (editionModeOnStatus === true && overEventOnCardContainer === false) {
  //     document.querySelectorAll('.card-container').forEach((el) => {
  //       el.style.backgroundColor = 'white';
  //       el.setAttribute('active', false);
  //     });
  //     mainContainer.setAttribute('active', true);
  //     mainContainer.style.backgroundColor = 'aliceblue';
  //   }
  // });

  function mainContainerActivityHighlighting(e) {
    mainContainer.addEventListener(e, () => {
      if (editionModeOnStatus === true && overEventOnCardContainer === false) {
        firstAddImgInputContainer.style.backgroundColor = 'initial';
        firstAddImgInputContainer.style.boxShadow = 'none';

        document.querySelectorAll('.card-container').forEach((el) => {
          el.style.backgroundColor = 'white';
          el.setAttribute('active', false);
        });
        mainContainer.setAttribute('active', true);
        mainContainer.style.backgroundColor = 'aliceblue';
      }
    });
  }

  ['click', 'drop', 'contextmenu'].forEach((el) => {
    mainContainerActivityHighlighting(el);
  });
}
mainContainerDragAndDropEvents();

// function handleDragDropEvent(oEvent, txtDiv) {
//   switch (oEvent.type) {
//     case 'dragover':
//     case 'dragenter':
//       oEvent.returnValue = false;
//       break;
//     case 'drop':
//       txtDiv.innerText = oEvent.dataTransfer.getData('text');
//   }
// }

// function dropEventOnCards() {
//   document.querySelectorAll('.card-container').forEach((el) => {
//     el.addEventListener('drop', () => {
//       handleDragDropEvent(event, el.getElementsByClassName('textFitted')[0]);
//     });
//   });
// }

mainContainer.addEventListener('drop', function (e) {
  if (document.querySelector(".card-container[active='true']") === null) {
    addImg = true;
    handleDrop(e);
  }
});

addImages.addEventListener('change', function () {
  addImg = true;
  handleFiles(this.files);
});

const initialDropZone = document.getElementById('initial-drop-zone');

initialDropZone.addEventListener('dragleave', function () {
  this.style.backgroundColor = 'white';
});

initialDropZone.addEventListener('drop', function () {
  this.style.backgroundColor = 'white';
});

initialDropZone.addEventListener('drop', function (e) {
  addImg = true;
  handleDrop(e);
});

initialDropZone.addEventListener('dragover', function () {
  this.style.backgroundColor = 'whitesmoke';
});

initialDropZone.addEventListener('click', function () {
  addImages.click();
});
